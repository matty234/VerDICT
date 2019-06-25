import ForceGraph3D from '3d-force-graph';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { fromEvent, Subject } from 'rxjs';
import { filter, finalize, flatMap, map, takeUntil } from 'rxjs/operators';

import * as THREE from 'three';
import { Color, Material, MeshLambertMaterial, MeshMatcapMaterial } from 'three';
import { NavComponent } from '../core/nav/nav.component';
import { ShelfService } from '../core/shelf/shelf.service';
import { Gene } from '../directory/gene/gene.model';
import { CardiganPPIRelation } from '../directory/phenotype/phenotype.model';
import { PhenotypeService } from '../directory/phenotype/phenotype.service';
import { TargetExplorerService } from '../target-explorer/target-explorer.service';
import { LoadingOverlayService } from './loading-overlay/loading-overlay.service';
import { Materials } from './network.materials';
import { IMaterials, Link, Node } from './network.model';
import { NodeDetailsService } from './node-details/node-details.service';

@Component({
	selector: 'app-network',
	templateUrl: './network.component.html',
	styleUrls: [ './network.component.scss' ],
	providers: [
		{
			provide: IMaterials,
			useClass: Materials,
		},
	],
})
export class NetworkComponent implements OnInit, OnDestroy, AfterViewInit {
	private _depth = 0;
	private _showShortestPaths = true;

	private _graphValues = new CardiganPPIRelation({});

	get showShortestPaths(): boolean {
		return this._showShortestPaths;
	}

	set showShortestPaths(shouldShow: boolean) {
		this._showShortestPaths = shouldShow;
		this.loadResults();
	}

	get degreesToShow(): number {
		return this._depth;
	}

	set degreesToShow(v: number) {
		this._depth = v;
		this.loadResults();
	}

	get graphValues(): CardiganPPIRelation {
		return this._graphValues;
	}

	set graphValues(relations: CardiganPPIRelation) {
		this._graphValues = relations;
		this.graph.graphData(this._graphValues);
	}

	@ViewChild('graph') graphElement: ElementRef;
	@ViewChild('sidebar') sidebarElement: ElementRef;
	@ViewChild('wrapper') wrapperElement: ElementRef;

	graph: any;

	$unsubscribe = new Subject<void>();
	showOnlyGraph = false;

	constructor(
		private pService: PhenotypeService,
		private shelfService: ShelfService,
		private targetExplorerService: TargetExplorerService,
		private loadingOverlayService: LoadingOverlayService,
		private nodeDetailsService: NodeDetailsService,
		private materials: IMaterials,
	) {}

	ngOnInit() {
		this.graph = ForceGraph3D()(this.graphElement.nativeElement)
			.graphData(this.graphValues)
			.backgroundColor('#fafafa')
			.nodeLabel((node) => (node as Node).formattedTootlip)
			.linkOpacity(0.8)
			.nodeVal('size')
			.nodeThreeObject((node: Node) => {
				let material: MeshLambertMaterial;
				if (!node.isMultiplePrimary) {
					const materialCreator = (node.isSecondary) ? this.materials.secondary : this.materials.primary;
					material = materialCreator(node.color);
				} else {
					material = this.materials.multiple();
				}
				return new THREE.Mesh(
					[ new THREE.SphereGeometry(5), new THREE.BoxGeometry(5, 5, 5) ][node.isSecondary ? 1 : 0],
					material,
				);
			})
			.linkColor((link: Link) => (link.isShortestPath ? '#0862c3' : undefined))
			.showNavInfo(false)
			.d3Force('collide', d3.forceCollide(3))
			.width(this.graphElement.nativeElement.clientWidth)
			.height(this.wrapperElement.nativeElement.clientHeight)
			.onNodeHover((node) => (this.graphElement.nativeElement.style.cursor = node ? 'pointer' : null))
			.onNodeClick((node: Gene) => this.nodeDetailsService.openNodeDetails(node));

		fromEvent(window, 'resize').pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
			this.recalculateSize();
		});

		NavComponent.IS_DRAWER_OPEN.pipe(takeUntil(this.$unsubscribe)).subscribe((is) => {
			this.recalculateSize();
		});

		this.shelfService.mutate$.pipe(takeUntil(this.$unsubscribe)).subscribe(() => {
			this.loadResults();
		});

		this.loadResults();

		this.targetExplorerService.locationChange
			.pipe(takeUntil(this.$unsubscribe))
			.pipe(filter((location) => location.source === 'list'))
			.subscribe((location) => {
				const node = this.graph.graphData().nodes.find((findNode) => findNode.entrez === location.entrez);
				const distance = 80;
				const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);

				this.graph.cameraPosition(
					{ x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
					node,
					3000,
				);
			});
	}

	recalculateSize(): void {
		this.graph
			.width(this.graphElement.nativeElement.clientWidth)
			.height(this.wrapperElement.nativeElement.clientHeight);
	}

	ngAfterViewInit() {
		this.recalculateSize();
	}

	loadResults() {
		this.loadingOverlayService.open();
		if (this._showShortestPaths) {
			this.pService
				.getCardiganPredictionsOnPPI(this.shelfService.get(), this._depth)
				.pipe(
					takeUntil(this.$unsubscribe),
					flatMap((cpv: CardiganPPIRelation) => {
						return this.pService.getShortestPath(cpv.nodes, this.shelfService.get()).pipe(
							takeUntil(this.$unsubscribe),
							finalize(() => {
								this.loadingOverlayService.close();
							}),
							map((result) => {
								result.links = [ ...result.links, ...cpv.links ];
								return result;
							}),
						);
					}),
					finalize(() => {
						this.loadingOverlayService.close();
					}),
				)
				.subscribe((result) => {
					this.graphValues = result;
				});
		} else {
			this.pService
				.getCardiganPredictionsOnPPI(this.shelfService.get(), this._depth)
				.pipe(
					takeUntil(this.$unsubscribe),
					finalize(() => {
						this.loadingOverlayService.close();
					}),
				)
				.subscribe((newContentGroup: CardiganPPIRelation) => {
					this._showShortestPaths = false;
					this.graphValues = newContentGroup;
				});
		}
	}

	ngOnDestroy() {
		this.$unsubscribe.next();
		this.$unsubscribe.complete();
	}

	toggleSideBar() {
		/* this.showOnlyGraph = !this.showOnlyGraph;
		setTimeout(() => {
			this.recalculateSize();
		}, 10);*/
	}
}
