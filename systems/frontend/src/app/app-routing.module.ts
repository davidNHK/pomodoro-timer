import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
    path: 'auth',
  },
  {
    loadChildren: () =>
      import('./protected-app/protected-app.module').then(
        m => m.ProtectedAppModule,
      ),
    path: 'app',
  },
  { path: '', pathMatch: 'full', redirectTo: 'auth/login' },
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
})
export class AppRoutingModule {}
