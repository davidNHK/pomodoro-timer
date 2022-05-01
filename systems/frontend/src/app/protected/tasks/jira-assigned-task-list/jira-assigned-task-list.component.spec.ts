import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { from, Observable } from 'rxjs';

import { AssignedTask, AssignedTaskGQL } from '../graphql';
import { JiraAssignedTaskListComponent } from './jira-assigned-task-list.component';

describe('JiraAssignedTaskComponent', () => {
  async function setupTest({
    apiResponse,
  }: {
    apiResponse: Observable<{
      data?: {
        jiraAssignedTask: AssignedTask[];
      };
      loading: boolean;
    }>;
  }) {
    const { component, fixture } =
      await configureTestingModuleForComponent<JiraAssignedTaskListComponent>(
        JiraAssignedTaskListComponent,
        {
          providers: [
            {
              provide: AssignedTaskGQL,
              useValue: { fetch: () => apiResponse },
            },
          ],
        },
      );
    return { component, fixture };
  }
  it('should bind api response to variable', async () => {
    const { component } = await setupTest({
      apiResponse: from([
        { loading: true },
        {
          data: {
            jiraAssignedTask: [
              { key: 'TEST-1', summary: 'Test 1', summaryText: 'Test 1' },
            ],
          },
          loading: false,
        },
      ]),
    });
    expect(component.jiraAssignedTasks.length).toEqual(1);
  });
});
