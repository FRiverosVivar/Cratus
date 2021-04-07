import { Component } from '@angular/core';
import { BlesService } from 'src/app/services/bles/bles.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { SelectModalPage } from './select-modal/select-modal.page';
import { RestService } from 'src/app/services/rest/rest.service';
import { DataService } from 'src/app/services/data/data.service';

import { ChartDataSets, ChartOptions } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-estadisticasTab',
  templateUrl: 'estadisticasTab.page.html',
  styleUrls: ['estadisticasTab.page.scss']
})
export class EstadisticasTabPage {
  public user: any = null;

  // cosas para graficar:
  lineChartData: ChartDataSets[] = null;
  lineChartLabels: Label[] = null;
  lineChartOptions = {
    responsive: true,
  };
  lineChartColors: Color[] = [
    { borderColor: 'rgba(0,255,0,0.5)' },
    { borderColor: 'rgba(255,0,0,0.5)' },
    { borderColor: 'rgba(0,0,255,0.5)' }
  ];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  constructor(
    public blesService: BlesService,
    public alertController: AlertController,
    private router: Router,
    public modalController: ModalController,
    private restService: RestService,
    public dataService: DataService,
  ) {}

  ionViewDidEnter(){
    this.user = this.restService.getUser();
    if (this.blesService.devices.length == 0) {
      //this.presentAlert();
    }
  }

  grafico() {
    let mejor = this.dataService.getEstadisticas().map((i) => (i.mejor/1000).toFixed(2));
    let peor = this.dataService.getEstadisticas().map((i) => (i.peor/1000).toFixed(2));
    let promedio = this.dataService.getEstadisticas().map((i) => (i.promedio/1000).toFixed(2));
    let labels = this.dataService.getEstadisticas().map((i, j) => j + 1);

    this.lineChartData = [
      { data: mejor, label: 'Mejor' },
      { data: peor, label: 'Peor' },
      { data: promedio, label: 'Promedio' }
    ];
    this.lineChartLabels = labels;
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Actualmente no tiene dispositivos vinculados.',
      backdropDismiss: false,
      buttons: [{
        text: 'Vicunlar',
        handler: () => {
          this.router.navigate(['tabs']);
        }
      }]
    });

    await alert.present();
  }

  async seleccionModal() {
    const modal = await this.modalController.create({
      component: SelectModalPage,
      showBackdrop: true,
      animated: true,
      componentProps: {
        user: this.user,
      }
    });

    // por si nito hacer algo cuando cierre
    modal.onDidDismiss().then(
      (res) => this.grafico(),
    )
    return await modal.present();
  }
}
