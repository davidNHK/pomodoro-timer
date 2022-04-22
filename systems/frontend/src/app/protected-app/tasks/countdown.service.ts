import { Injectable } from '@angular/core';
import { interval, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  running = false;

  start(ms: number) {
    this.running = true;
    const numberOfInterval =
      ms % 500 === 0 ? ms / 500 : Math.floor(ms / 500) + 1;

    return interval(500).pipe(
      map(count => count + 1),
      take(numberOfInterval === 0 ? 1 : numberOfInterval),
    );
  }
}
