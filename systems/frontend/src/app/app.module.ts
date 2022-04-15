import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { AuthComponent } from './auth/auth.component';
import { CallbackComponent } from './auth/callback/callback.component';
import { LoginComponent } from './auth/login/login.component';
import { ProtectedAppComponent } from './protected-app/protected-app.component';
import { TimerComponent } from './protected-app/timer/timer.component';

const routes: Routes = [
  {
    children: [
      { component: LoginComponent, path: 'login' },
      { component: CallbackComponent, path: 'callback' },
    ],
    component: AuthComponent,
    path: 'auth',
  },
  { component: ProtectedAppComponent, path: 'app' },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];

@NgModule({
  bootstrap: [AppComponent],
  declarations: [
    AppComponent,
    AuthComponent,
    CallbackComponent,
    LoginComponent,
    TimerComponent,
    ProtectedAppComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    MatListModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  providers: [],
})
export class AppModule {}
