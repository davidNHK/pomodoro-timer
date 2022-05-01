import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatMs',
})
export class FormatMsPipe implements PipeTransform {
  transform(value: number): string {
    const minutes = Math.floor(value / 60000);
    const seconds = Math.floor((value % 60000) / 1000);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`;
  }
}
