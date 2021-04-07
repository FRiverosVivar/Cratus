import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadisticasTabPage } from './estadisticasTab.page';
import { ExploreContainerComponentModule } from 'src/app/components/explore-container/explore-container.module';

import { SelectModalPageModule } from './select-modal/select-modal.module';
import { SelectModalPage } from './select-modal/select-modal.page';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    SelectModalPageModule,
    RouterModule.forChild([{ path: '', component: EstadisticasTabPage }]),
    ChartsModule,
  ],
  entryComponents: [SelectModalPage],
  declarations: [EstadisticasTabPage]
})
export class EstadisticasTabPageModule {}
