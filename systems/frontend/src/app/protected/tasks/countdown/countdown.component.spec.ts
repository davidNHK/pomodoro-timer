import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { of } from 'rxjs';

import { CountdownService } from '../countdown.service';
import { FormatMsPipe } from '../format-ms.pipe';
import { SetUserFocusTaskGQL } from '../graphql';
import { CountdownComponent, CountdownType } from './countdown.component';

describe('CountdownComponent', () => {
  async function setupTest({ apiResponse }: { apiResponse: any }) {
    const { component } = await configureTestingModuleForComponent(
      CountdownComponent,
      {
        declarations: [CountdownComponent, FormatMsPipe],
        providers: [
          CountdownService,
          {
            provide: SetUserFocusTaskGQL,
            useValue: {
              mutate: () => apiResponse,
            },
          },
        ],
      },
    );
    return { component };
  }
  it('should call start focus task when type is Pomodoro', async () => {
    const { component } = await setupTest({
      apiResponse: of({
        data: {
          fake: '123',
        },
      }),
    });
    component.type = CountdownType.POMODORO;
    expect(component.isTimerRunning).toBeFalsy();
    component.start();
    expect(component.countdownSubscription).toBeDefined();
    expect(component.isTimerRunning).toBeTruthy();
  });
});
