import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: '',
    canActivate: [() => import('./auth/auth.guard').then(m => m.authGuard)],
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  { path: '**', redirectTo: '' }
];
