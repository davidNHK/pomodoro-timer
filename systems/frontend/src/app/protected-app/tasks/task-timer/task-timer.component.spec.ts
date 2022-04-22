import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { CountdownComponent } from '../countdown/countdown.component';
import { FormatMsPipe } from '../format-ms.pipe';
import { TaskTimerComponent } from './task-timer.component';

describe('TaskTimerComponent', () => {
  async function setupTest() {
    const { component } = await configureTestingModuleForComponent(
      TaskTimerComponent,
      {
        declarations: [TaskTimerComponent, FormatMsPipe, CountdownComponent],
      },
    );
    return { component };
  }
  it('complete pomodoro will set selectedIndex to short break', async () => {
    const { component } = await setupTest();
    expect(component.selectedIndex).toEqual(0);
    component.completePomodoro();
    expect(component.selectedIndex).toEqual(1);
  });

  it('complete break will set selectedIndex to pomodoro', async () => {
    const { component } = await setupTest();
    component.selectedIndex = 1;
    expect(component.selectedIndex).toEqual(1);
    component.completeBreak();
    expect(component.selectedIndex).toEqual(0);
  });
});
