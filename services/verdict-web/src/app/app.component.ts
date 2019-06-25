import { Component } from '@angular/core';
import { fromEvent, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: [ './app.component.scss' ],
})
export class AppComponent {
	isOnline$ = merge(
		fromEvent(window, 'offline').pipe(map(() => false)),
		fromEvent(window, 'online').pipe(map(() => true)),
		Observable.create((sub) => {
			sub.next(navigator.onLine);
			sub.complete();
		}),
	);

	title = 'Paccanaro Lab';
}
