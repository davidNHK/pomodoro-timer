import { Component } from '@angular/core';

import { CountdownService } from '../countdown.service';
import { CountdownType } from '../countdown/countdown.component';
import { FinishFocusedTaskGQL, SetUserFocusTaskGQL } from '../graphql';

const CountdownTabIndex = {
  [CountdownType.POMODORO]: 0,
  [CountdownType.SHORT_BREAK]: 1,
  [CountdownType.LONG_BREAK]: 2,
};

@Component({
  selector: 'app-task-timer',
  styleUrls: ['./task-timer.component.css'],
  templateUrl: './task-timer.component.html',
})
export class TaskTimerComponent {
  CountdownType = CountdownType;

  selectedIndex = CountdownTabIndex[CountdownType.POMODORO];

  constructor(
    private countDownService: CountdownService,
    private setUserFocusTaskGQL: SetUserFocusTaskGQL,
    private finishFocusedTaskGQL: FinishFocusedTaskGQL,
  ) {}

  get isTimerRunning(): boolean {
    return this.countDownService.running;
  }

  completePomodoro() {
    this.selectedIndex = CountdownTabIndex[CountdownType.SHORT_BREAK];
  }

  completeBreak() {
    this.selectedIndex = CountdownTabIndex[CountdownType.POMODORO];
  }

  taskFinish() {
    this.finishFocusedTaskGQL
      .mutate({
        taskId: this.countDownService.taskFocused()?.id,
      })
      .subscribe(({ data }) => {
        if (!!data) {
          this.selectedIndex = CountdownTabIndex[CountdownType.POMODORO];
        }
      });
  }

  startPomodoro() {
    this.setUserFocusTaskGQL
      .mutate({
        taskId: this.countDownService.taskFocused()?.id,
      })
      .subscribe();
  }
}
