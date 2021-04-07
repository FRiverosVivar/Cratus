import { Component, Input, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest/rest.service';
import { DataService } from 'src/app/services/data/data.service';
import { BlesService } from 'src/app/services/bles/bles.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-crear-rutina',
  templateUrl: './crear-rutina.page.html',
  styleUrls: ['./crear-rutina.page.scss'],
})
export class CrearRutinaPage {
  user: object = null;
  rutina: any = [];
  nombreRutina: string = "";

  constructor(
    private router: Router,
    private restService: RestService,
    private dataService: DataService,
    public blesService: BlesService,
    public loadingController: LoadingController,
    private changeDetectorRef: ChangeDetectorRef,
    public alertController: AlertController,
  ) {
    this.user = this.restService.getUser();
    console.log("CrearRutinaPage: ", this.user);
  }

  ionViewWillEnter(){
  }

  ionViewDidEnter() {
  }

  ingresarPaso(dispositivo, color){
    this.rutina.push({dispositivo, color});
  }

  eliminarPaso(step, i){
    delete this.rutina[i];

    this.rutina = this.rutina.filter((i) => i);
    this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
  }

  crearRutina(){
    this.restService.crearRutina(this.rutina, this.nombreRutina).then(
      (res) => {
        console.log("header crearRutina: ", res.headers);
        console.log("crearRutina: ", res.data);
        const header = res.headers;
        const data = JSON.parse(res.data);
        if (data.status == "ok") {
          this.restService.saveSession(header, this.user);
          this.creadaAlert();
        }
      },
      (error) => console.log("crearRutina error: ", JSON.stringify(error))
    )
  }

  test(algo){
    console.log("test: ", JSON.stringify(algo));
  }

  async confirmacionAlert(step, i) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Desea eliminar este paso?',
      buttons: [{
        text: 'si',
        handler: () => {
          this.eliminarPaso(step, i);
        }
      },{
        text: 'no',
        handler: () => {}
      }]
    });

    await alert.present();
  }

  async creadaAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'la rutina ha sido creada',
      buttons: [{
        text: 'ok',
        handler: () => {
          this.router.navigate(['tabs/programaTab'], {replaceUrl: true})
        }
      }]
    });

    await alert.present();
  }

  async presentLoading(mensaje = "Cargando...", tiempo = 1000) {
    const loading = await this.loadingController.create({
      message: mensaje,
      duration: tiempo,
    });

    await loading.present();

    return loading.onDidDismiss();
  }
}
