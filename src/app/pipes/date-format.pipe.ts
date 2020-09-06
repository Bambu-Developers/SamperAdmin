import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'DateFormatPipe'
})
export class DateFormatPipe implements PipeTransform {
    transform(value: string) {
        const datePipe = new DatePipe('es-ES');
        value = datePipe.transform(value, 'MMM-dd-yyyy');
        return value;
    }
}
