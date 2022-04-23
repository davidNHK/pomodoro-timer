import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { mergeMap, Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { CountdownService } from '../countdown.service';
import { SetUserFocusTaskGQL } from '../graphql';

export enum CountdownType {
  LONG_BREAK = 'long break',
  POMODORO = 'pomodoro',
  SHORT_BREAK = 'short break',
}

@Component({
  selector: 'app-countdown',
  styleUrls: ['./countdown.component.css'],
  templateUrl: './countdown.component.html',
})
export class CountdownComponent implements OnInit {
  @Input()
  declare type: CountdownType;

  @Output()
  countdownComplete: EventEmitter<{
    type: CountdownType;
  }> = new EventEmitter();

  protected countdownMs = 0;

  countdownSubscription?: Subscription;

  runDown = 0;

  constructor(
    private countDownService: CountdownService,
    private setUserFocusTaskGQL: SetUserFocusTaskGQL,
  ) {}

  private getCountdownMs(): number {
    switch (this.type) {
      case CountdownType.POMODORO:
        return 60000 * 25;
      case CountdownType.SHORT_BREAK:
        return 60000 * 5;
      case CountdownType.LONG_BREAK:
        return 60000 * 15;
      default:
        return 0;
    }
  }

  ngOnInit(): void {
    this.countdownMs = this.getCountdownMs();
    this.runDown = this.countdownMs;
  }

  get isTimerRunning(): boolean {
    return this.countDownService.running;
  }

  get canStartTimer(): boolean {
    return this.countDownService.canStart();
  }

  private reset() {
    this.countDownService.stop();
    this.runDown = this.countdownMs;
  }

  private complete() {
    this.reset();
    this.countdownComplete.emit({
      type: this.type,
    });
  }

  start(): void {
    let countdownObservable: Observable<number>;
    if (this.type === CountdownType.POMODORO) {
      countdownObservable = this.setUserFocusTaskGQL
        .mutate({
          taskId: this.countDownService.taskFocused()?.id,
        })
        .pipe(
          filter(({ data }) => !!data),
          mergeMap(() => this.countDownService.start(this.countdownMs)),
        );
    } else {
      countdownObservable = this.countDownService.start(this.countdownMs);
    }
    this.countdownSubscription = countdownObservable.subscribe({
      complete: () => this.complete(),
      next: ms => {
        this.runDown = this.countdownMs - ms;
      },
    });
  }

  stop(): void {
    this.countdownSubscription?.unsubscribe();
    this.reset();
  }
}
