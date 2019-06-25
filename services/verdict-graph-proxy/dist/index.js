"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const http = require("http");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const graph_query_builder_1 = require("./graph-query.builder");
const neo4j_service_1 = require("./services/neo4j.service");
const app = express();
app.use(cors());
app.use(bodyParser.json());
const neo4j = new neo4j_service_1.Neo4jService({
    user: process.env.DB_USER || 'neo4j',
    password: process.env.DB_PASSWORD || 'neo4j',
    uri: process.env.DB_URI || 'bolt://localhost:7688',
    queryTimeout: parseInt(process.env.QUERY_TIMEOUT, 10) || 10000
});
const httpRoot = process.env.HTTP_ROOT || '';
app.post(httpRoot + '/depth/:ppidegrees', (req, res) => {
    const ppidegrees = parseInt(req.params.ppidegrees, 10);
    if (ppidegrees < 0 || ppidegrees > 3) {
        const reason = {
            reason: {
                name: 'invalid-degrees',
                message: 'Invalid PPI degrees provided'
            },
            notify: true
        };
        res.status(500).send(reason);
        return;
    }
    const prepend = 'WITH [] AS phenotypes\n';
    const append = `\nUNWIND phenotypes as pheno
					UNWIND pheno.nodes AS startnode
					OPTIONAL MATCH limitedNodesInteractions=(startnode)-[:INTERACTS_WITH*..${ppidegrees}]-(endnodes)
					WITH REDUCE(output = [],
						r in collect(DISTINCT [r IN relationships(limitedNodesInteractions)
							| {start: STARTNODE(r).entrez, end: ENDNODE(r).entrez}])| output + r) as steps,
					collect(DISTINCT startnode) as startnodepredicted,

					REDUCE(output = [],
						r in collect([r in relationships(limitedNodesInteractions) | ENDNODE(r)]) |
					output + r) as endnodes,

					REDUCE(output = [],
						r in collect([r in relationships(limitedNodesInteractions) | STARTNODE(r)]) |
					output + r) as  startnodes, pheno

					return pheno.uid as uid, pheno.phenotype as phenotype,
						startnodepredicted as roots, steps, startnodes + endnodes as nodes`;
    const shelfHandlers = {
        diseaseShelfValueHander: (disease) => {
            return `OPTIONAL MATCH (pheno:PHENOTYPE{omim: ${disease.omim}})-[rela:${disease.geneSet}]->(nodes)\n
			WITH pheno, nodes, phenotypes ORDER BY ${disease.geneSet === 'HAS_GENE'
                ? 'pheno.name'
                : 'rela.score'} DESC, nodes.entrez DESC LIMIT ${disease.limit}
			 WITH phenotypes + {uid: '${disease.uid}', phenotype: pheno, nodes: collect(nodes)} as phenotypes\n`;
        },
        customGeneGroupShelfValueHander: (geneGroup) => {
            return `WITH [] as genes, phenotypes
			${geneGroup.genes
                .map((gene) => `OPTIONAL MATCH (a:GENE{entrez: ${gene.entrez}}) WITH collect(a) + genes as genes, phenotypes`)
                .join('\n')}
			WITH phenotypes + {uid: '${geneGroup.uid}', nodes: genes} as phenotypes\n`;
        }
    };
    const queryBuilder = new graph_query_builder_1.GraphQueryBuilder(prepend, append, shelfHandlers).addShelfItem(req.body);
    const query = neo4j
        .query(queryBuilder.build(), { id: parseInt(req.params.id, 10) })
        .pipe(operators_1.catchError((err) => {
        const reason = {
            reason: err,
            notify: true
        };
        res.status(500).send(reason);
        return rxjs_1.of(null);
    }), operators_1.filter((e) => !!e))
        .subscribe((red) => {
        res.contentType('application/json').status(200).send(red.records);
    });
    req.on('close', () => {
        query.unsubscribe();
    });
});
app.post(httpRoot + '/shortestpaths', (req, res) => {
    const prepend = 'WITH [] AS genes\n';
    const append = `\nwith genes[0..length(genes)/2] as side1, reverse(genes)[..(length(genes)+1/2)] as side2
					unwind side1 as side1uw
					unwind side2 as side2uw
					WITH side1uw, side2uw
					MATCH sp = shortestPath((side1uw)-[:INTERACTS_WITH*]-(side2uw))
					RETURN sp`;
    const shelfHandlers = {
        diseaseShelfValueHander: (disease) => {
            return `
			OPTIONAL MATCH (start:PHENOTYPE{omim: ${disease.omim}})-[r:${disease.geneSet}]->(end:GENE{})
			WHERE (end)-[:INTERACTS_WITH]-()
			WITH end, genes, r ORDER BY ${disease.geneSet === 'HAS_GENE'
                ? 'start.name'
                : 'r.score'} DESC, end.entrez DESC LIMIT ${disease.limit}
			WITH genes + collect(end) as genes\n`;
        },
        customGeneGroupShelfValueHander: (geneGroup) => {
            return ` ${geneGroup.genes
                .map((gene) => `OPTIONAL MATCH (a:GENE{entrez: ${gene.entrez}})
					WHERE (a)-[:INTERACTS_WITH]-()
					WITH genes + collect(a) as genes
					`)
                .join('\n')}
		`;
        }
    };
    const queryBuilder = new graph_query_builder_1.GraphQueryBuilder(prepend, append, shelfHandlers).addShelfItem(req.body);
    const query = neo4j
        .query(queryBuilder.build(), { id: parseInt(req.params.id, 10) })
        .pipe(operators_1.catchError((err) => {
        const reason = {
            reason: err,
            notify: true
        };
        console.log(err);
        res.status(500).send(reason);
        return rxjs_1.of(null);
    }), operators_1.filter((e) => !!e))
        .subscribe((red) => {
        res.contentType('application/json').status(200).send(red.records);
    });
    req.on('close', () => {
        query.unsubscribe();
    });
});
app.post(httpRoot + '/intersection', (req, res) => {
    const prepend = '\n';
    const append = `\n`;
    const shelfHandlers = {
        diseaseShelfValueHander: (disease) => {
            return `
			OPTIONAL MATCH (start:PHENOTYPE{omim: ${disease.omim}})-[r:${disease.geneSet}]->(end:GENE{})
			WHERE (end)-[:INTERACTS_WITH]-()
			WITH end, genes, r ORDER BY ${disease.geneSet === 'HAS_GENE'
                ? 'start.name'
                : 'r.score'} DESC, end.entrez DESC LIMIT ${disease.limit}
			WITH genes + collect(end) as genes\n`;
        },
        customGeneGroupShelfValueHander: (geneGroup) => {
            return ` ${geneGroup.genes
                .map((gene) => `OPTIONAL MATCH (a:GENE{entrez: ${gene.entrez}})
					WHERE (a)-[:INTERACTS_WITH]-()
					WITH genes + collect(a) as genes
					`)
                .join('\n')}
		`;
        }
    };
    const queryBuilder = new graph_query_builder_1.GraphQueryBuilder(prepend, append, shelfHandlers).addShelfItem(req.body);
    const query = neo4j
        .query(queryBuilder.build(), { id: parseInt(req.params.id, 10) })
        .pipe(operators_1.catchError((err) => {
        const reason = {
            reason: err,
            notify: true
        };
        console.log(err);
        res.status(500).send(reason);
        return rxjs_1.of(null);
    }), operators_1.filter((e) => !!e))
        .subscribe((red) => {
        res.contentType('application/json').status(200).send(red.records);
    });
    req.on('close', () => {
        query.unsubscribe();
    });
});
http.createServer(app).listen(process.env.PORT || 8080);
//# sourceMappingURL=index.js.map