import { CdkStepper, STEPPER_GLOBAL_OPTIONS, StepperSelectionEvent } from '@angular/cdk/stepper';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ImportStatus } from './importer.model';

@Component({
	selector: 'app-importer',
	templateUrl: './importer.component.html',
	styleUrls: [ './importer.component.scss' ],
	providers: [
		{
			provide: STEPPER_GLOBAL_OPTIONS,
			useValue: { displayDefaultIndicatorType: false },
		},
	],
})
export class ImporterComponent implements OnInit {
	importChoices = ImportChoice;
	importType: ImportChoice = null;
	completed: boolean;
	result: ImportStatus;

	@ViewChild('stepper') stepper: CdkStepper;

	constructor(private cd: ChangeDetectorRef) {}

	ngOnInit() {
		this.stepper.selectionChange.subscribe((sChange: StepperSelectionEvent) => {
			switch (sChange.selectedIndex) {
				case 0:
					this.importType = null;
					this.completed = false;
					this.result = null;
					break;
			}
		});
	}

	chooseImport(choice: ImportChoice) {
		this.importType = choice;
		this.stepper.next();
	}

	onComplete(result: ImportStatus) {
		this.completed = true;
		this.result = result;
		this.stepper.next();
		this.cd.detectChanges();
	}

	getResultString(): string {
		return this.result ? `Successfully added ${this.result.success} value${this.result.success === 0 ? '' : 's'} to the shelf` : '';
	}
}

enum ImportChoice {
	KEGG,
	EXAMPLE,
	CSV,
}
