import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material';
import { AboutComponent } from './about.component';

@NgModule({
	imports: [ CommonModule, MatCardModule ],
declarations: [ AboutComponent ],
})
export class AboutModule {}
