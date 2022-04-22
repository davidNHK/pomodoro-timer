import { Injectable } from '@angular/core';
import { interval, map, take } from 'rxjs';

import type { Task } from './graphql';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  running = false;

  private workingTask: Task | null = null;

  canStart() {
    return this.workingTask !== null && !this.running;
  }

  focusOn(task: Task | null) {
    this.workingTask = task;
  }

  taskFocused() {
    return this.workingTask;
  }

  start(ms: number) {
    this.running = true;
    const numberOfInterval =
      ms % 500 === 0 ? ms / 500 : Math.floor(ms / 500) + 1;

    return interval(500).pipe(
      map(count => count * 500),
      take(numberOfInterval === 0 ? 1 : numberOfInterval),
    );
  }

  stop() {
    this.running = false;
  }
}
