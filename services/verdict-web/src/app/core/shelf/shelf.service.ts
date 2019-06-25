import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { MatSnackBar } from '@angular/material';
import { isArray } from 'util';
import { Gene } from '../../directory/gene/gene.model';
import { CustomGeneGroupShelfValue, StoredShelfValue } from './shelf.model';

export interface IShelfService {
	add(newValue: StoredShelfValue): void;
	dragDropArrange(event: CdkDragDrop<StoredShelfValue>): void;
	get(): StoredShelfValue[];
	getByUid<T extends StoredShelfValue>(uid: string): T;
	addToGeneGroup(uid: string, gene: Gene | Gene[]): void;
	removeFromGeneGroup(uid: string, geneId: number): void;
	getTarget(): StoredShelfValue;
	getItemIndex(uid: string): number;
	delete(ssv: StoredShelfValue): void;
	change(id: string, value: Partial<StoredShelfValue>): void;
	clear(): void;
}

@Injectable({
	providedIn: 'root',
})
export class ShelfService implements IShelfService {
	static STORAGE_KEY = 'SHELF';
	storedShelfValues = new Array<StoredShelfValue>();
	mutate$ = new Subject<StoredShelfValue>();

	constructor(private matSnackBar: MatSnackBar) {
		this.storedShelfValues = JSON.parse(localStorage.getItem(ShelfService.STORAGE_KEY) || '[]');
	}

	add(newValue: StoredShelfValue): void {
		if (!this.storedShelfValues.some((existing) => existing === newValue)) {
			this.storedShelfValues.push(newValue);
			this.mutate$.next(newValue);
			localStorage.setItem(ShelfService.STORAGE_KEY, JSON.stringify(this.storedShelfValues));
		}
		this.matSnackBar.open('New gene group created', null, {
			duration: 3000,
		});
	}

	dragDropArrange(event: CdkDragDrop<StoredShelfValue>): void {
		moveItemInArray(this.storedShelfValues, event.previousIndex, event.currentIndex);
		localStorage.setItem(ShelfService.STORAGE_KEY, JSON.stringify(this.storedShelfValues));
		this.mutate$.next(this.storedShelfValues[event.currentIndex]);
	}

	get(): StoredShelfValue[] {
		return this.storedShelfValues;
	}

	getByUid<T extends StoredShelfValue>(uid: string): T {
		this.storedShelfValues = JSON.parse(localStorage.getItem(ShelfService.STORAGE_KEY) || '[]');
		return this.storedShelfValues.find((ssv) => ssv.uid === uid) as T;
	}

	addToGeneGroup(uid: string, gene: Gene | Gene[]): void {
		this.storedShelfValues = JSON.parse(localStorage.getItem(ShelfService.STORAGE_KEY) || '[]');
		const targetShelfValue = this.storedShelfValues.find((ssv) => ssv.uid === uid);
		if (CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(targetShelfValue)) {
			if (isArray(gene)) {
				targetShelfValue.genes = gene;
			} else {
				targetShelfValue.genes.push(gene);
			}
		}
		localStorage.setItem(ShelfService.STORAGE_KEY, JSON.stringify(this.storedShelfValues));
		this.mutate$.next(targetShelfValue);
	}

	removeFromGeneGroup(uid: string, geneId: number): void {
		this.storedShelfValues = JSON.parse(localStorage.getItem(ShelfService.STORAGE_KEY) || '[]');
		const targetShelfValue = this.storedShelfValues.find((ssv) => ssv.uid === uid);
		if (CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(targetShelfValue)) {
			targetShelfValue.genes = targetShelfValue.genes.filter((gene) => gene.entrez !== geneId);
		}
		localStorage.setItem(ShelfService.STORAGE_KEY, JSON.stringify(this.storedShelfValues));
		this.mutate$.next(targetShelfValue);
	}

	getTarget(): StoredShelfValue {
		return this.storedShelfValues && this.storedShelfValues.length > 0 ? this.storedShelfValues[0] : null;
	}

	getItemIndex(uid: string): number {
		this.storedShelfValues = JSON.parse(localStorage.getItem(ShelfService.STORAGE_KEY) || '[]');
		const x = this.storedShelfValues.findIndex((ssV) => ssV.uid === uid);
		return x;
	}

	delete(ssv: StoredShelfValue): void {
		this.storedShelfValues = this.storedShelfValues.filter((v) => {
			return v !== ssv;
		});
		this.mutate$.next(ssv);
		localStorage.setItem(ShelfService.STORAGE_KEY, JSON.stringify(this.storedShelfValues));
		this.matSnackBar.open('Gene group deleted', null, {
			duration: 3000,
		});
	}

	change(id: string, value: Partial<StoredShelfValue>): void {
		const index = this.getItemIndex(id);
		this.storedShelfValues[index] = {
			...this.storedShelfValues[index],
			...value,
		};
		this.mutate$.next(this.storedShelfValues[index]);
		localStorage.setItem(ShelfService.STORAGE_KEY, JSON.stringify(this.storedShelfValues));
	}

	clear(): void {
		localStorage.removeItem(ShelfService.STORAGE_KEY);
	}
}
