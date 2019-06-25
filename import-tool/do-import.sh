#!/bin/sh

neo4j-admin import --nodes:PHENOTYPE /var/lib/neo4j/import/output/disease.nodes.txt --nodes:GENE /var/lib/neo4j/import/output/gene.nodes.txt --relationships /var/lib/neo4j/import/output/disease-cardigan-gene.txt --relationships /var/lib/neo4j/import/output/disease-morbidmap-gene.txt --relationships /var/lib/neo4j/import/output/disease-sim-disease.txt --relationships /var/lib/neo4j/import/output/gene-interacts-gene.txt --id-type=INTEGER --delimiter="|"  --ignore-duplicate-nodes --ignore-missing-nodes

exec /var/lib/neo4j/bin/neo4j console
