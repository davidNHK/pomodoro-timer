import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
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
    await TestBed.configureTestingModule({
      declarations: [AddTaskComponent],
      imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatInputModule,
        MatCardModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
      ],
      providers: [{ provide: CreateTaskGQL, useValue: apiResponse }],
    }).compileComponents();
    const fixture = TestBed.createComponent(AddTaskComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
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
