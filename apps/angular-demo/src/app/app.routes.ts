import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./nx-welcome').then(m => m.NxWelcome),
  },
  {
    path: 'books',
    loadComponent: () =>
      import('../book/book-list').then(m => m.BookList),
  }
];
