import { Routes } from '@angular/router';

import { appRoutesNames } from './app.routes.names';

import { GridAngularEngineComponent } from './containers';

export const routes: Routes = [
  {
    path: appRoutesNames.angularEngineGrid,
    component: GridAngularEngineComponent,
  },
  // {
  //   path: appRoutesNames.customEngineGrid,
  //   component: null,
  // },
  {
    path: '**',
    redirectTo: appRoutesNames.angularEngineGrid,
    pathMatch: 'full',
  },
];
