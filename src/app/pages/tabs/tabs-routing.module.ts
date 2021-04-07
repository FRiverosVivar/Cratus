import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'vinculacionTab',
        children: [{
          path: '',
          loadChildren: () => import('../vinculacionTab/vinculacionTab.module').then(m => m.VinculacionTabPageModule)
        }]
      },
      {
        path: 'perfilTab',
        children: [{
          path: '',
          loadChildren: () => import('../perfilTab/perfilTab.module').then(m => m.PerfilTabPageModule)
        }]
      },
      {
        path: 'programaTab',
        children: [{
          path: '',
          loadChildren: () => import('../programaTab/programaTab.module').then(m => m.ProgramaTabPageModule)
        }]
      },
      {
        path: 'estadisticasTab',
        children: [{
          path: '',
          loadChildren: () => import('../estadisticasTab/estadisticasTab.module').then(m => m.EstadisticasTabPageModule)
        }]
      },
      {
        path: '',
        redirectTo: '/tabs/vinculacionTab',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/tabs/vinculacionTab',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
