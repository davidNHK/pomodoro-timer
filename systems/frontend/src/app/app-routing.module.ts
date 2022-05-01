import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    loadChildren: () =>
      import('./auth/auth-routing.module').then(m => m.AuthRoutingModule),
    path: 'auth',
  },
  {
    loadChildren: () =>
      import('./protected/protected.module').then(m => m.ProtectedModule),
    path: 'app',
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
