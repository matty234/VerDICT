import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoreModule } from '../core/core.module';
import { MaterialModule } from '../material.module';
import { CardiganComponent } from './cardigan.component';

@NgModule({
	imports: [ CommonModule, MaterialModule, CoreModule ],
	declarations: [ CardiganComponent ],
})
export class CardiganModule {}
