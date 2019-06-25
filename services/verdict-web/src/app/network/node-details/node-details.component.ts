import { Component, ElementRef, HostListener, Inject, InjectionToken, OnInit } from '@angular/core';
import { noop, Subject } from 'rxjs';
import { CustomGeneGroupShelfValue, DiseaseShelfValue } from 'src/app/core/shelf/shelf.model';
import { ShelfService } from 'src/app/core/shelf/shelf.service';
import { Gene } from 'src/app/directory/gene/gene.model';
import { TargetExplorerService } from 'src/app/target-explorer/target-explorer.service';

export const NODE_INJECTION_TOKEN = new InjectionToken<{}>('NODE_INJ');

@Component({
	selector: 'app-node-details',
	templateUrl: './node-details.component.html',
	styleUrls: [ './node-details.component.css' ],
})
export class NodeDetailsComponent implements OnInit {
	shelfGroupSelectables = new Array<ShelfGroupSelectable>();
	shelfGroupSecondarySelectables = new Array<ShelfGroupSelectable>();
	shouldClose = new Subject<void>();

	constructor(
		@Inject(NODE_INJECTION_TOKEN) public gene: Gene,
		private shelfService: ShelfService,
		private scrollToService: TargetExplorerService,
		private elementRef: ElementRef,
	) {	}

	@HostListener('document:click', [ '$event' ])
	clickedOutsideHandler($event: Event) {
		if (!this.elementRef.nativeElement.contains(event.target)) {
			this.shouldClose.next();
		}
	}

	ngOnInit() {
		this.gene.shelfMembership.forEach((uid) => {
			const shelfValue = this.shelfService.getByUid(uid);
			if (CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(shelfValue)) {
				this.shelfGroupSelectables.push(
					new ShelfGroupSelectable({
						name: shelfValue.name,
						type: 'custom',
					}),
				);
			} else if (DiseaseShelfValue.isDiseaseShelfValue(shelfValue)) {
				this.shelfGroupSelectables.push(
					new ShelfGroupSelectable({
						select: () => {
							this.scrollToService.scrollToGene(uid, this.gene.entrez);
							this.shouldClose.next();
						},
						name: shelfValue.name,
						type: 'disease',
					}),
				);
			}
		});
		this.gene.secondaryShelfMembership
			.filter(
				(membership) => !this.gene.shelfMembership.find((primaryMembership) => primaryMembership === membership),
			)
			.forEach((uid) => {
				const shelfValue = this.shelfService.getByUid(uid);
				if (CustomGeneGroupShelfValue.isCustomGeneGroupShelfValue(shelfValue)) {
					this.shelfGroupSecondarySelectables.push(
						new ShelfGroupSelectable({
							name: shelfValue.name,
							type: 'custom',
						}),
					);
				} else if (DiseaseShelfValue.isDiseaseShelfValue(shelfValue)) {
					this.shelfGroupSecondarySelectables.push(
						new ShelfGroupSelectable({
							name: shelfValue.name,
							type: 'disease',
						}),
					);
				}
			});
	}
}

class ShelfGroupSelectable {
	name: string;
	type: 'disease' | 'custom' = 'custom';

	constructor({ name, type, select }: Partial<ShelfGroupSelectable>) {
		this.select = select || noop;
		this.name = name;
		this.type = type || 'custom';
	}

	select: () => void = () => {
		return;
	}
}
