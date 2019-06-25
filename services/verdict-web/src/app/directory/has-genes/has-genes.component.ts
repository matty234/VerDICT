import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { DirectoryComponent } from '../../directory/directory.component';
import { Gene } from '../gene/gene.model';

@Component({
	selector: 'app-has-genes',
	templateUrl: './has-genes.component.html',
	styleUrls: [ './has-genes.component.css' ],
})
export class HasGenesComponent implements OnInit {
	@Input() genes: Gene[];
	constructor(
	) {}

	ngOnInit() {}
}
