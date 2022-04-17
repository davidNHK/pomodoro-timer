import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TimerComponent } from './timer/timer.component';

const routes: Routes = [{ component: TimerComponent, path: '' }];

@NgModule({
  declarations: [TimerComponent],
  exports: [RouterModule],
  imports: [CommonModule, RouterModule.forChild(routes)],
  providers: [],
})
export class ProtectedAppModule {}
