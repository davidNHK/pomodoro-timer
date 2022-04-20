import { configureTestingModuleForComponent } from '@app-test-helper/configure-testing-module';
import { from, Observable } from 'rxjs';

import { CreateTaskGQL } from '../graphql';
import { AddTaskComponent } from './add-task.component';

describe('AddTaskComponent', () => {
  async function setupTest({
    apiResponse,
  }: {
    apiResponse: {
      mutate: () => Observable<{
        data?: any;
        errors?: any;
        loading: boolean;
      }>;
    };
  }) {
    const { component, fixture } = await configureTestingModuleForComponent(
      AddTaskComponent,
      {
        declarations: [AddTaskComponent],
        providers: [{ provide: CreateTaskGQL, useValue: apiResponse }],
      },
    );
    return { component, fixture };
  }

  it('should call mutate and show loading when submit form', async () => {
    const mutate = jasmine
      .createSpy()
      .and.returnValue(from([{ loading: true }]));
    const { component, fixture } = await setupTest({
      apiResponse: { mutate },
    });
    component.toggleInputForm();
    expect(component.shouldShowInputForm).toBeTruthy();
    component.form.setValue({
      notes: '',
      title: 'test',
    });
    component.submitForm();
    expect(mutate).toHaveBeenCalledWith({
      data: {
        notes: '',
        title: 'test',
      },
    });
    fixture.detectChanges();
    const element = fixture.nativeElement;
    expect(
      element.querySelector("[data-testid='loading-description']"),
    ).not.toBeNull();
  });
});
