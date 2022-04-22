import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { FormatMsPipe } from '../format-ms.pipe';
import { CountdownComponent } from './countdown.component';

describe('CountdownComponent', () => {
  it('should create', async () => {
    const { component } = await configureTestingModuleForComponent(
      CountdownComponent,
      {
        declarations: [CountdownComponent, FormatMsPipe],
      },
    );
    expect(component).toBeTruthy();
  });
});
