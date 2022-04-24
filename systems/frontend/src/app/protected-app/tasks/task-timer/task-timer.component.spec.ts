import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { Observable, of } from 'rxjs';

import { GraphQLModule } from '../../../graphql.module';
import { CountdownService } from '../countdown.service';
import { CountdownComponent } from '../countdown/countdown.component';
import { FormatMsPipe } from '../format-ms.pipe';
import { RecordPomodoroGQL, TodoGQL } from '../graphql';
import { TaskTimerComponent } from './task-timer.component';

describe('TaskTimerComponent', () => {
  async function setupTest({
    recordPomodoro,
    todo,
  }: {
    recordPomodoro: Observable<{
      data: any;
    }>;
    todo: Observable<{ data: any }>;
  }) {
    const { component, fixture } = await configureTestingModuleForComponent(
      TaskTimerComponent,
      {
        declarations: [TaskTimerComponent, FormatMsPipe, CountdownComponent],
        imports: [GraphQLModule, RouterModule.forRoot([])],
        providers: [
          {
            provide: RecordPomodoroGQL,
            useValue: { mutate: () => recordPomodoro },
          },
          { provide: TodoGQL, useValue: { fetch: () => todo } },
        ],
      },
    );
    return { component, fixture };
  }
  it('complete pomodoro will set selectedIndex to long break when completed pomodoro is mod of 3', async () => {
    const { component, fixture } = await setupTest({
      recordPomodoro: of({ data: {} }),
      todo: of({
        data: {
          taskOnFocus: {
            completedPomodoro: 3,
          },
        },
      }),
    });
    const countdown = TestBed.inject(CountdownService);
    countdown.focusOn({ id: '1234', title: 'Test Task' });
    expect(component.selectedIndex).toEqual(0);
    component.completePomodoro();
    await fixture.whenStable();
    expect(component.selectedIndex).toEqual(2);
  });

  it('complete pomodoro will set selectedIndex to short break', async () => {
    const { component, fixture } = await setupTest({
      recordPomodoro: of({ data: {} }),
      todo: of({
        data: {
          taskOnFocus: {
            completedPomodoro: 1,
          },
        },
      }),
    });
    const countdown = TestBed.inject(CountdownService);
    countdown.focusOn({ id: '1234', title: 'Test Task' });
    expect(component.selectedIndex).toEqual(0);
    component.completePomodoro();
    await fixture.whenStable();
    expect(component.selectedIndex).toEqual(1);
  });

  it('complete break will set selectedIndex to pomodoro', async () => {
    const { component } = await setupTest({
      recordPomodoro: of({ data: {} }),
      todo: of({
        data: {
          taskOnFocus: {
            completedPomodoro: 1,
          },
        },
      }),
    });
    component.selectedIndex = 1;
    expect(component.selectedIndex).toEqual(1);
    component.completeBreak();
    expect(component.selectedIndex).toEqual(0);
  });
});
