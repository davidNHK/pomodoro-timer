import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';

import { TasksModule } from '../tasks/tasks.module';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  it('should create', async () => {
    const { component } = await configureTestingModuleForComponent(
      HomeComponent,
      {
        imports: [TasksModule],
      },
    );
    expect(component).toBeTruthy();
  });
});
