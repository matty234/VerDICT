"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const neo4j_driver_1 = require("neo4j-driver");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
class Neo4jService {
    constructor(config) {
        this.config = config;
        this.driver = neo4j_driver_1.v1.driver(config.uri, neo4j_driver_1.v1.auth.basic(config.user, config.password), {
            disableLosslessIntegers: true,
        });
    }
    query(query, parameters) {
        const session = this.driver.session();
        return rxjs_1.Observable.create((observer) => {
            session
                .run(query, parameters)
                .then((result) => {
                session.close();
                observer.next(result);
            }, (error) => {
                session.close();
                observer.error(error);
            })
                .then(() => {
                observer.complete();
            });
        }).pipe(operators_1.timeout(this.config.queryTimeout), operators_1.finalize(() => {
            session.close();
        }));
    }
    destroy() {
        this.driver.close();
    }
}
exports.Neo4jService = Neo4jService;
//# sourceMappingURL=neo4j.service.js.map