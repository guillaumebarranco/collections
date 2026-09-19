import { Pipe, PipeTransform } from '@angular/core';
import { splitPersonNames } from '../../../utils/cancelled-people.utils';

@Pipe({
  name: 'personNames',
  standalone: true,
})
export class PersonNamesPipe implements PipeTransform {
  transform(value: string | null | undefined): string[] {
    return splitPersonNames(value);
  }
}
