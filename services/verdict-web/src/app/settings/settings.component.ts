import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { ShelfService } from '../core/shelf/shelf.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: [ './settings.component.css' ],
})
export class SettingsComponent implements OnInit {
	constructor(
		private shelfService: ShelfService	) {}

	ngOnInit() {}

	clearShelf() {
		this.shelfService.clear();
	}
}
