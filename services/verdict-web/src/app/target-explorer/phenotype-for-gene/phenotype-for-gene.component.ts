import { ChangeDetectorRef, Component, Inject, InjectionToken, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Gene } from 'src/app/directory/gene/gene.model';
import { GeneService } from 'src/app/directory/gene/gene.service';
import { Phenotype } from 'src/app/directory/phenotype/phenotype.model';

export const TARGET_GENE_ENTREZ = new InjectionToken<Gene>('TARGET_GENE_ENTREZ');

@Component({
	selector: 'app-phenotype-for-gene',
	templateUrl: './phenotype-for-gene.component.html',
	styleUrls: [ './phenotype-for-gene.component.scss' ],
})
export class PhenotypeForGeneComponent implements OnInit, OnDestroy {
	belongsTo: Phenotype[] = null;
	destroy = new Subject<void>();

	constructor(
		@Inject(TARGET_GENE_ENTREZ) public gene: Gene,
		private changeDetector: ChangeDetectorRef,
		private gService: GeneService,
		private router: Router,
	) {}

	loadTargets(): void {
			this.gService.getPhenotypesForGene(this.gene.entrez)
			.subscribe((v) => {
				this.belongsTo = v;
				this.changeDetector.detectChanges();
			});
	}

	ngOnInit() {
		this.loadTargets();
	}

	ngOnDestroy() {
		this.destroy.next();
		this.destroy.unsubscribe();
	}
}
