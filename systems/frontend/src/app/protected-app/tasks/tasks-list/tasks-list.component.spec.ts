import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { of } from 'rxjs';

import { AllTasksGQL } from '../graphql';
import { TasksListComponent } from './tasks-list.component';

describe('TasksListComponent', () => {
  it('should show empty list header', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      TasksListComponent,
      {
        declarations: [TasksListComponent],
        providers: [
          {
            provide: AllTasksGQL,
            useValue: {
              watch: () => {
                return { valueChanges: of({ data: { tasks: [] } }) };
              },
            },
          },
        ],
      },
    );
    const element = fixture.nativeElement;
    expect(
      element.querySelector('[data-testId="empty-list-header"]'),
    ).not.toBeNull();
  });

  it('should show list items', async () => {
    const { fixture } = await configureTestingModuleForComponent(
      TasksListComponent,
      {
        declarations: [TasksListComponent],
        providers: [
          {
            provide: AllTasksGQL,
            useValue: {
              watch: () => {
                return {
                  valueChanges: of({
                    data: { tasks: [{ title: 'Test 1' }, { title: 'Test2' }] },
                  }),
                };
              },
            },
          },
        ],
      },
    );
    const element = fixture.nativeElement;
    expect(
      element.querySelectorAll('[data-testId*="task-list-item"]').length,
    ).toEqual(2);
  });

  it('should show selected item', async () => {
    const { component, fixture } = await configureTestingModuleForComponent(
      TasksListComponent,
      {
        declarations: [TasksListComponent],
        providers: [
          {
            provide: AllTasksGQL,
            useValue: {
              watch: () => {
                return {
                  valueChanges: of({
                    data: { tasks: [{ title: 'Test 1' }, { title: 'Test2' }] },
                  }),
                };
              },
            },
          },
        ],
      },
    );
    component.selectedTask = { id: '1', title: 'Test 1' };
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(
      element.querySelector('[data-testId="selected-task"]'),
    ).not.toBeNull();
  });
});
