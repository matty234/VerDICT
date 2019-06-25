import { ShelfService, IShelfService } from './shelf.service';
import { StoredShelfValue, DiseaseShelfValue } from './shelf.model';
import { Gene } from '../../directory/gene/gene.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Subject } from 'rxjs';
import { CustomGeneGroupShelfValue } from 'src/app/core/shelf/shelf.model';

export class MockShelfService implements IShelfService {
	mockValues: Array<StoredShelfValue> = [
		{
			...new CustomGeneGroupShelfValue({
				genes: []
			}),
			uid: 't-123'
		}
	];

	mutate$ = new Subject<StoredShelfValue>();

	add(newValue: StoredShelfValue): void {
		throw new Error('Method not implemented.');
	}
	dragDropArrange(event: CdkDragDrop<StoredShelfValue, StoredShelfValue>): void {
		throw new Error('Method not implemented.');
	}
	get(): StoredShelfValue[] {
		throw new Error('Method not implemented.');
	}
	getByUid<T extends StoredShelfValue>(uid: string): T {
		return this.mockValues[0] as T;
	}
	addToGeneGroup(uid: String, gene: Gene | Gene[]): void {
		throw new Error('Method not implemented.');
	}
	removeFromGeneGroup(uid: String, geneId: number): void {
		throw new Error('Method not implemented.');
	}
	getTarget(): StoredShelfValue {
		throw new Error('Method not implemented.');
	}
	getItemIndex(uid: string): number {
		throw new Error('Method not implemented.');
	}
	delete(ssv: StoredShelfValue): void {
		throw new Error('Method not implemented.');
	}
	change(id: string, value: Partial<StoredShelfValue>): void {
		throw new Error('Method not implemented.');
	}
	clear(): void {
		throw new Error('Method not implemented.');
	}
}
