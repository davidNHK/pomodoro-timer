import type { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { of } from 'rxjs';

import { CountdownService } from '../countdown.service';
import { FormatMsPipe } from '../format-ms.pipe';
import { SetUserFocusTaskGQL } from '../graphql';
import { CountdownComponent, CountdownType } from './countdown.component';

describe('CountdownComponent', () => {
  async function setupTest({ apiResponse }: { apiResponse: any }) {
    const { component, fixture } = await configureTestingModuleForComponent(
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
    return { component, fixture };
  }

  function selectCountDownButton(element: DebugElement) {
    return element.query(By.css("[data-testid='start-count-down-button']"))!;
  }

  it('should call start focus task when type is Pomodoro', async () => {
    const { component, fixture } = await setupTest({
      apiResponse: of({
        data: {
          fake: '123',
        },
      }),
    });
    component.type = CountdownType.POMODORO;
    expect(component.isTimerRunning).toBeFalsy();
    const countdownElement: DebugElement = fixture.debugElement;
    selectCountDownButton(countdownElement).triggerEventHandler('click', null);
    await fixture.detectChanges();
    await fixture.whenStable();
    expect(component.countdownSubscription).toBeDefined();
    expect(component.isTimerRunning).toBeTruthy();
  });
});
