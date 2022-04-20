import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { TaskTimerComponent } from './task-timer.component';

describe('TaskTimerComponent', () => {
  it('should create', async () => {
    const { component } = await configureTestingModuleForComponent(
      TaskTimerComponent,
      {
        declarations: [TaskTimerComponent],
      },
    );
    expect(component).toBeTruthy();
  });
});
