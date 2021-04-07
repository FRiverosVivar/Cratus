import { Component } from '@angular/core';
import { RestService } from 'src/app/services/rest/rest.service';
import { BlesService } from 'src/app/services/bles/bles.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfilTab',
  templateUrl: 'perfilTab.page.html',
  styleUrls: ['perfilTab.page.scss']
})
export class PerfilTabPage {
  public user: any = null;

  constructor(
    private restService: RestService,
    public blesService: BlesService,
    public alertController: AlertController,
    private router: Router,
  ) {
  }

  ionViewDidEnter(){
    this.user = this.restService.getUser();

    if (this.blesService.devices.length == 0) {
      this.presentAlert();
    }
  }

  cerrarSession(){
    this.restService.removeSession();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Actualmente no tiene dispositivos vinculados.',
      backdropDismiss: true,
      buttons: [{
        text: 'VINCULAR',
        handler: () => {
          this.router.navigate(['tabs']);
        }
      }]
    });

    await alert.present();
  }
}
