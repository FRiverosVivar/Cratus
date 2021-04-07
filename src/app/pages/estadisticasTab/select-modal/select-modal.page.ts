import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest/rest.service';
import { DataService } from 'src/app/services/data/data.service';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-select-modal',
  templateUrl: './select-modal.page.html',
  styleUrls: ['./select-modal.page.scss'],
})
export class SelectModalPage {

  @Input() user: object;  // entredor
  entrenados = [];
  entrenado = null;
  rutinas = [];
  rutina = null;

  status = 0;

  constructor(
    private modal: ModalController,
    private router: Router,
    private restService: RestService,
    private dataService: DataService,
    public loadingController: LoadingController,
  ) {
  }

  ionViewWillEnter(){
    this.presentLoading(500);
  }
  ionViewDidEnter() {
    this.restService.listaEntrenados().then(
      (res) => {
        let data = JSON.parse(res.data);
        this.entrenados = data.data;
      }
    )

    this.restService.getRutinas().then(
      (res) => {
        let data = JSON.parse(res.data);
        this.rutinas = data.data;
      }
    )
  }

  selecionEntrenado(entrenado){
    console.log("entrenado: ", JSON.stringify(entrenado));

    this.entrenado = entrenado;
    this.dataService.setEntrenado(entrenado);
    this.presentLoading(500).then( () => this.status = 1 );
  }

  selecionRutina(rutina){
    console.log("rutina: ", JSON.stringify(rutina));

    this.rutina = rutina;
    this.dataService.setRutina(rutina);
    this.estadisticas();
    this.presentLoading(500);
  }

  estadisticas() {
    this.restService.estadisticas(this.entrenado, this.rutina).then(
      (res) => {
        let data = JSON.parse(res.data);

        if (res.status == 200) {
          console.log("estadisticas: ", JSON.stringify(data.data));
          this.dataService.setEstadisticas(data.data);
          this.cerrar();
        }
      }
    )
  }

  async cerrar(){
    await this.modal.dismiss();
  }

  async presentLoading(ms) {
    const loading = await this.loadingController.create({
      message: "",
      duration: ms,
    });

    await loading.present();

    return loading.onDidDismiss();
  }
}
