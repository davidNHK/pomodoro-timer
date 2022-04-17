import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  styleUrls: ['./add-task.component.css'],
  templateUrl: './add-task.component.html',
})
export class AddTaskComponent implements OnInit {
  shouldShowInputForm = true;

  form!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  toggleInputForm() {
    this.shouldShowInputForm = !this.shouldShowInputForm;
    this.form.reset();
  }

  submitForm() {
    console.log(this.form.value);
  }

  get notes() {
    return this.form.get('notes');
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
