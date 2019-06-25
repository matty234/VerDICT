import { NoopScrollStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal, PortalInjector } from '@angular/cdk/portal';
import {
	Component,
	ElementRef,
	forwardRef,
	Inject,
	InjectionToken,
	Injector,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { EventEmitter } from 'protractor';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { StoredShelfValue } from '../shelf/shelf.model';
import { ShelfService } from '../shelf/shelf.service';
import { ColourPickerService } from './colour-picker.service';

const CURRENT_COLOUR = new InjectionToken<{}>('COLOUR_DATA');

@Component({
	selector: 'app-colour-picker-overlay',
	templateUrl: './colour-picker-overlay.component.html',
	styleUrls: [ './colour-picker-overlay.component.scss' ],
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => ColourPickerOverlayComponent),
			multi: true,
		},
	],
})
export class ColourPickerOverlayComponent implements OnInit, ControlValueAccessor {
	defaultColours = [ 'FF0000', '00FF00', '0000FF', '169643', '19225f', '00adff' ];

	isValid: boolean = undefined;

	hexRegex = /^([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})/.compile();

	private _customValue = '';

	set customValue(value: string) {
		if (this.hexRegex.test(value)) {
			this._customValue = value;
			this.selectColour(value);
		}
	}

	get customValue(): string {
		return this._customValue;
	}

	propagateChange: (_: any) => any = (_: any) => {};
	noop: (_: any) => any = (_: any) => {};

	constructor() {}

	ngOnInit() {}

	selectColour(colour: string): void {
		this.propagateChange('#' + colour);
	}

	writeValue(obj: any): void {
		this._customValue = obj.substring(1, obj.length);
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		fn = this.noop;
	}

	setDisabledState?(isDisabled: boolean): void {}
}
