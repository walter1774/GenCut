import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: 'home',
    loadComponent: () => import('./views/home/home').then( m => m.Home)
   },
    {  path: 'calculate',
    loadComponent: () => import('./views/calculate/calculate').then( m => m.Calculate)
   },
       {  path: 'record',
    loadComponent: () => import('./views/record/record').then( m => m.Record)
   },

   {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];
