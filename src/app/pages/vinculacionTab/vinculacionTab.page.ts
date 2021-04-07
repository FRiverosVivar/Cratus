import { Component } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BlesService } from 'src/app/services/bles/bles.service';

@Component({
  selector: 'app-vinculacionTab',
  templateUrl: 'vinculacionTab.page.html',
  styleUrls: ['vinculacionTab.page.scss']
})
export class VinculacionTabPage {

  public devices = [];

  constructor(
    private ble: BLE,
    private blesService: BlesService,
  ) {
    this.devices = [];
  }

  ionViewDidEnter(){
    this.blesService.enableBluetooth();
    this.blesService.enableGPS();
  }

  scanBLE(){
    this.blesService.enableBluetooth();
    this.blesService.enableGPS();
    console.log("se empezara a escanear: ");
    let devices = [];
    let count = 0
    this.ble.startScan([]).subscribe(
      (device) => {
        console.log("finded: " + JSON.stringify(device))
        count++
        if (!!device.name) {
          devices.push(device);
        }
      },
      (error) => console.log("erro scan: " + JSON.stringify(error))
    );

    setTimeout(() => this.ble.stopScan().then((res) => this.devices = devices),  4000)
  }

  add(device){
    this.blesService.addDevice(device);
  }

  remove(device){
    this.blesService.removeDevice(device);
  }
  obtenerNombre(d){
    
    this.ble.connect(d.id).subscribe((data)=>{
      if(data){
        console.log("DATA "+JSON.stringify(data))
        console.log("DATA NAME :"+data.name)
      }
    })

    setTimeout(()=>{
      this.ble.disconnect(d.id)
    },6000)
  }
  vinculado(device) {
    if(this.blesService.devices.filter((d) => d.id == device.id).length >= 1){
      return true;
    } else {
      return false;
    }
  }

}
