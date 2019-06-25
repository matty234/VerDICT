import { v1 } from 'neo4j-driver';
import { Driver, StatementResult } from 'neo4j-driver/types/v1';
import { Observable, Observer } from 'rxjs';
import { finalize, timeout } from 'rxjs/operators';

export class Neo4jService {
	private driver: Driver;

	constructor(private config: IDBConfig) {
		this.driver = v1.driver(config.uri, v1.auth.basic(config.user, config.password), {
			disableLosslessIntegers: true,
		});
	}

	public query(query: string, parameters?: any): Observable<StatementResult> {
		const session = this.driver.session();
		return Observable.create((observer: Observer<StatementResult>) => {
			session
				.run(query, parameters)
				.then(
					(result) => {
						session.close();
						observer.next(result);
					},
					(error) => {
						session.close();
						observer.error(error);
					}
				)
				.then(() => {
					observer.complete();
				});
		}).pipe(timeout(this.config.queryTimeout), finalize(() => {
			session.close();
		}));
	}

	public destroy() {
		this.driver.close();
	}
}

export interface IDBConfig {
	uri: string;
	user: string;
	password: string;
	queryTimeout: number;
}
