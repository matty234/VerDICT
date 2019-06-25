import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { mergeMap, takeUntil } from 'rxjs/operators';

import { GeneService } from '../gene/gene.service';
import { Phenotype } from '../phenotype/phenotype.model';

@Component({
	selector: 'app-gene-belongs-to-phenotypes',
	templateUrl: './gene-belongs-to-phenotypes.component.html',
	styleUrls: [ './gene-belongs-to-phenotypes.component.scss' ],
})
export class GeneBelongsToPhenotypesComponent implements OnInit, OnDestroy {
	@Input() gene: Observable<number>;

	private $destroy = new Subject<void>();

	$phenotypes: Observable<Phenotype[]>;

	constructor(private gService: GeneService) {}

	ngOnInit() {
		this.$phenotypes = this.gene.pipe(takeUntil(this.$destroy), mergeMap((id) => this.gService.getPhenotypesForGene(id)));
	}

	ngOnDestroy() {
		this.$destroy.next();
		this.$destroy.unsubscribe();
	}
}
