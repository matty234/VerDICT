import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { forkJoin, fromEvent, of, Subject } from 'rxjs';
import { FromEventTarget } from 'rxjs/internal/observable/fromEvent';
import { filter, flatMap, map, mergeMap, takeUntil, tap, toArray } from 'rxjs/operators';
import { CustomGeneGroupShelfValue } from 'src/app/core/shelf/shelf.model';
import { GeneService } from 'src/app/directory/gene/gene.service';
import { ImportStatus } from 'src/app/home/importer/importer.model';
import { isNumber } from 'util';
import { ShelfService } from '../shelf/shelf.service';

@Component({
	selector: 'app-csv-import',
	templateUrl: './csv-import.component.html',
	styleUrls: [ './csv-import.component.css' ],
})
export class CsvImportComponent implements OnDestroy {
	@ViewChild('csvInput') csvInput: ElementRef;
	@ViewChild('submitButton') submitButton: ElementRef;

	$destroy = new Subject<void>();
	@Output() complete = new EventEmitter<ImportStatus>();
	constructor(private gService: GeneService, private shelfService: ShelfService) {}

	submit() {
		of(this.csvInput.nativeElement.value || '')
			.pipe(
				takeUntil(this.$destroy),
				filter((value) => value !== ''),
				map((e) => e.split(',').map((r: string) => r.trim()) as string[]),
				flatMap((x) => x),
				mergeMap((value) => this.gService.getGene(Number(value))),
				toArray(),
				map((genes) => genes.filter((gene) => !!gene)),
			)
			.subscribe((genes) => {
				if (genes.length > 0) {
					this.shelfService.add(
						new CustomGeneGroupShelfValue({
							name: 'Custom Gene Group',
							colour: '#00FF00',
							genes,
						}),
					);
					this.complete.next({
						count: genes.length,
						success: genes.length,
						fail: 0,
					});
				}
			});
	}

	ngOnDestroy() {
	this.$destroy.next();
	this.$destroy.unsubscribe();
	}
}
