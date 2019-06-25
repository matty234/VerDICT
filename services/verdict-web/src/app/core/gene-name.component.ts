import { ChangeDetectorRef, Component, Input, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

import { Gene } from '../directory/gene/gene.model';

@Component({
	selector: 'app-gene-name',
	template: `<div class="gene-group">
							<mat-chip-list class="chip-list" *ngIf="order !== -1">
								<mat-chip color="accent">{{order}}</mat-chip>
							</mat-chip-list>
							<div class="name gene-list-item">
								<span class="official_name">{{gene.official_symbol}}</span>
								<span class="id">{{gene.entrez}}</span>
							</div>
							<ng-content></ng-content>
							<button (click)="openNCBI(gene.entrez, $event)" mat-icon-button color="primary"><mat-icon>open_in_new</mat-icon></button>
						</div>`,
	styles: [
		`
		:host {
			width: 100%
		}
		.chip-list {
			display: flex;
			margin-right: 5px;
		}

		.id {
			padding-left: 5px;
			color: #656565;
			font-weight: 300;
			padding-right: 5px;
			display: inline;
		}
		.omim {
			color: #656565;
			font-weight: 300;
			padding-right: 5px;
			display: inline;
		}
		.gene-list-item {
			cursor: pointer;
			outline: none;
			user-select: none;
			align-self: center;
		}
		.gene-group {
			display: flex;
			justify-content: space-between;
		}
		.name {
			flex-grow: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			margin-right: 10px;
		}
		`,
	],
})
export class GeneNameComponent implements OnInit {
	@Input() gene: Gene;
	@Input() order = -1;

	constructor(private router: Router, private zone: NgZone, private cd: ChangeDetectorRef) {}

	ngOnInit() {}

	openNCBI(id: number, e: Event) {
		e.stopPropagation();
		window.open(environment.ncbi + id, '_blank');
	}
}
