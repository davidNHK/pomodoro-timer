import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { ProtectedAppComponent } from './protected-app.component';
import { TasksModule } from './tasks/tasks.module';

const routes: Routes = [
  {
    children: [{ component: HomeComponent, path: '' }],
    component: ProtectedAppComponent,
    path: '',
  },
];

@NgModule({
  declarations: [ProtectedAppComponent, HomeComponent],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TasksModule,
    MatToolbarModule,
    MatDividerModule,
  ],
  providers: [],
})
export class ProtectedAppModule {}
