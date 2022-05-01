import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { filter, mergeMap, tap } from 'rxjs/operators';

import { CountdownService } from '../countdown.service';
import { CountdownType } from '../countdown/countdown.component';
import {
  FinishFocusedTaskGQL,
  RecordPomodoroGQL,
  SetUserFocusTaskGQL,
  TodoGQL,
} from '../graphql';

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
  loading = false;

  CountdownType = CountdownType;

  selectedIndex = CountdownTabIndex[CountdownType.POMODORO];

  constructor(
    private countDownService: CountdownService,
    private setUserFocusTaskGQL: SetUserFocusTaskGQL,
    private finishFocusedTaskGQL: FinishFocusedTaskGQL,
    private recordPomodoroGQL: RecordPomodoroGQL,
    private todoGQL: TodoGQL,
    private snackBar: MatSnackBar,
  ) {}

  get isTimerRunning(): boolean {
    return this.countDownService.running;
  }

  private openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  completePomodoro() {
    this.recordPomodoroGQL
      .mutate({
        taskId: this.countDownService.taskFocused()!.id,
      })
      .pipe(
        tap(({ loading }) => {
          this.loading = loading;
        }),
        filter(({ data }) => !!data),
        mergeMap(() => this.todoGQL.fetch({})),
        tap(({ loading }) => {
          this.loading = loading;
        }),
      )
      .subscribe(({ data }) => {
        const takeCompletedPomodoro = data?.taskOnFocus?.completedPomodoro ?? 0;
        this.openSnackBar(
          `🎉🎉🎉 ${takeCompletedPomodoro} Pomodoro completed! 🎉🎉🎉`,
        );
        const shouldTakeLongBreak = takeCompletedPomodoro % 3 === 0;
        this.selectedIndex =
          CountdownTabIndex[
            shouldTakeLongBreak
              ? CountdownType.LONG_BREAK
              : CountdownType.SHORT_BREAK
          ];
        return data;
      });
  }

  completeBreak() {
    this.selectedIndex = CountdownTabIndex[CountdownType.POMODORO];
    this.openSnackBar(`💪🏻💪🏻💪🏻 Start new pomodoro 💪🏻💪🏻💪🏻`);
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
