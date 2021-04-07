import { Injectable } from '@angular/core';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { AlertController, Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BlesService {

  public devices = [];

  constructor(
    private diagnostic: Diagnostic,
    private platform: Platform,
    public alertController: AlertController,
  ) {
    console.log("construyendo blesservices: " + JSON.stringify(this.devices));
  }


  enableBluetooth(){
    this.diagnostic.getBluetoothState().then(
      (state) => {
        console.log("Bluetooth state: "+state);
        if(state === this.diagnostic.bluetoothState.POWERED_ON)
          console.log("Bluetooth is able to connect ");
        else
          this.enableBluetoothAlert();
      },
      (error) => console.log('getBluetoothState error? ', JSON.stringify(error))
    )
  }

  enableGPS(){
    this.diagnostic.isGpsLocationEnabled().then(
      (state) => {
        console.log("isGpsLocationEnabled: ", JSON.stringify(state));

        if(state)
        console.log("GPS is able");
        else
        this.enableGPSAlert();
      },
      (error) => console.log('getBluetoothState error? ', JSON.stringify(error))
    )
  }

  addDevice(device: any){
    device['isConnected'] = false;
    this.devices.push(device);
    console.log("añadido " + JSON.stringify(this.devices));
  }

  updateStatusDevice(device: any, status:boolean){

  }

  removeDevice(device: any){
    this.devices = this.devices.filter((d) => d.id != device.id);
    console.log("removido " + JSON.stringify(this.devices));
  }

  async enableBluetoothAlert(){
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'Bluetooth desconectado',
      message: 'Se requiere habilitar el Bluetooth de su dispositivo',
      buttons: [{
        text: 'Habilitar',
        handler: () => {
          if(this.platform.is('ios') == true){
            this.diagnostic.switchToSettings()
          }else{
            this.diagnostic.switchToBluetoothSettings();
          }
        }
      }]
    })
    await alert.present();
  }

  async enableGPSAlert(){
    const alert = await this.alertController.create({
      header: 'Atención',
      subHeader: 'GPS desconectado',
      message: 'Se requiere habilitar el GPS de su dispositivo',
      buttons: [{
        text: 'Habilitar',
        handler: () => {
          if(this.platform.is('ios') == true){
            this.diagnostic.switchToSettings()
          }else{
            this.diagnostic.switchToLocationSettings();
          }
        }
      }]
    })
    await alert.present();
  }
}
