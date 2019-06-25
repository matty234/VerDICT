import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'appPhenotypeName' })
export class PhenotypeNamePipe implements PipeTransform {
	transform(value: string[]|string): string {
	return value[0];
	}
}
