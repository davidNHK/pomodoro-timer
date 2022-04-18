import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';

import { AuthComponent } from './auth.component';
import { AuthService } from './auth.service';
import { CallbackComponent } from './callback/callback.component';
import { LoginComponent } from './login/login.component';

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
  exports: [],
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterModule.forChild(routes),
  ],
  providers: [AuthService],
})
export class AuthRoutingModule {}
