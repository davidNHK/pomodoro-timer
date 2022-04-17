import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from '@app/app/auth/auth.component';
import { LoginComponent } from '@app/app/auth/login/login.component';

import { CallbackComponent } from './callback/callback.component';

const routes: Routes = [
  {
    children: [
      { component: LoginComponent, path: 'login' },
      { component: CallbackComponent, path: 'callback' },
    ],
    component: AuthComponent,
    path: '',
  },
];

@NgModule({
  declarations: [CallbackComponent, AuthComponent, LoginComponent],
  exports: [RouterModule],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class AuthModule {}
