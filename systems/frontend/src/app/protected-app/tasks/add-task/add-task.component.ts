import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CreateTaskGQL } from '../graphql';

@Component({
  selector: 'app-add-task',
  styleUrls: ['./add-task.component.css'],
  templateUrl: './add-task.component.html',
})
export class AddTaskComponent implements OnInit {
  shouldShowInputForm = false;

  submissionLoading = false;

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private createTask: CreateTaskGQL,
    private _snackBar: MatSnackBar,
  ) {}

  toggleInputForm() {
    this.shouldShowInputForm = !this.shouldShowInputForm;
    this.form.reset();
  }

  submitForm() {
    this.createTask
      .mutate({
        data: this.form.value,
      })
      .subscribe(({ errors, loading }) => {
        this.submissionLoading = loading;
        if (!loading && !errors) {
          this._snackBar.open('Task created', '', { duration: 5000 });
          this.toggleInputForm();
        }
        if (errors)
          this._snackBar.open(
            'Something went wrong, please try again later',
            '',
            { duration: 2000 },
          );
      });
  }

  get title() {
    return this.form.get('title');
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      notes: [''],
      title: ['', Validators.required],
    });
  }
}