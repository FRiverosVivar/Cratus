import { IonicModule } from '@ionic/angular';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProgramaTabPage } from './programaTab.page';
import { CrearRutinaPage } from './crear-rutina/crear-rutina.page';

const routes: Routes = [
  { path: '', component: ProgramaTabPage },
  { path: 'crear-rutina', component: CrearRutinaPage },
];

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProgramaTabPage, CrearRutinaPage],
  entryComponents: [CrearRutinaPage],
})
export class ProgramaTabPageModule {}
