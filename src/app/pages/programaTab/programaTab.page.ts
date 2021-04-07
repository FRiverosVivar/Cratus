import { Component, ChangeDetectorRef } from '@angular/core';
import { BLE } from '@ionic-native/ble/ngx';
import { BlesService } from 'src/app/services/bles/bles.service';
import { RestService } from 'src/app/services/rest/rest.service';
import { AlertController, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DataService } from 'src/app/services/data/data.service';
import { JsonPipe } from '@angular/common';

const HEX = {
  verde: "00ff00",
  amarillo: "ffff00",
  rojo: "ff0000",
  morado: "ff00ff",
  azul: "0000ff",
};

@Component({
  selector: 'app-programaTab',
  templateUrl: 'programaTab.page.html',
  styleUrls: ['programaTab.page.scss']
})
export class ProgramaTabPage {
  public user: any
  public entrenado: any;
  public entrenados: any;
  public rutinas: any;
  public tipo = 0;
  public rutina = [];
  public rutinaPersonalizada: any;
  public pendiente = false;

  // for random mode
  public colores = ["verde", "amarillo", "rojo", "morado", "azul"];
  public acciones = 20; // total de acciones a iterar

  // for static mode
  public lastDevice = null;
  public semaforo: boolean = false;
  public bleNotificaciones;
  constructor(
    private ble: BLE,
    public blesService: BlesService,
    public restService: RestService,
    private dataService: DataService,
    public alertController: AlertController,
    private router: Router,
    public loadingController: LoadingController,
    private changeDetectorRef: ChangeDetectorRef,
    private platform: Platform
  ) {
    this.rutina = [];
  }

  ionViewDidEnter(){
    this.blesService.enableBluetooth();
    this.blesService.enableGPS();

    this.user = this.restService.getUser();

    if (this.blesService.devices.length == 0)
    this.presentAlert();
    else
    this.conectarBles();

    this.getEntrenados();
    this.getRutinas();

  }

  ionViewDidLeave(){
    this.desconectarBles();
  }

  getEntrenados(){
    this.restService.listaEntrenados().then(
      (res) => {
        let data = JSON.parse(res.data);
        if (data.status == "ok") {
          this.entrenados = data.data;
        }
      }
    )
  }

  seleccionarEntrenado(event){
    this.entrenado = event.target.value;
    this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
  }

  getRutinas(){
    this.restService.getRutinas().then(
      (res) => {
        console.log("getRutinas: ", res.data);
        const data = JSON.parse(res.data);

        if (data.status == "ok")
        this.rutinas = data.data;

        this.rutinas.forEach((rutina, i) => this.getRutina(rutina, i));
      },
      (error) => console.log("nani: ", JSON.stringify(error))
    )
  }

  getRutina(rutina, i){
    this.restService.getRutina(rutina).then(
      (res) => {
        console.log("getRutina: ", rutina.id, res.data);
        const data = JSON.parse(res.data);
        if (data.status == "ok")
        this.rutinas[i]['pasos_attributes'] = data.data;
      },
      (error) => console.log("error getRutina :", rutina.id, JSON.stringify(error))
    );
  }

  seleccionarPersonalizada(rutina){
    if (rutina.device_number > this.blesService.devices.length) return;
    this.rutinaPersonalizada = rutina;
    this.seleccionarPrograma(5);
  }

  iniciarPersonalizada(){
    if(this.rutina.length < this.rutinaPersonalizada['pasos_attributes'].length){
      let device = this.blesService.devices[this.rutinaPersonalizada['pasos_attributes'][this.rutina.length].dispositivo - 1];
      let color = this.rutinaPersonalizada['pasos_attributes'][this.rutina.length].color;
      console.log("iniciarPersonalizada: ", device.name, color);
      this.writetoDevice(device, color);
      this.presentLoading("Cargando...");
    }
    else return true;
  }

  conectarBles(){
    this.blesService.devices.forEach(
      (d, i) => this.ble.autoConnect(d.id,
        (res) => {
          this.blesService.devices[i].isConnected = true;
          this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
          console.log("autoConnect: ", JSON.stringify(res.name));
        },
        (error) => console.log("error autoConnect: ", JSON.stringify(error)),
      )
    )
  }

  desconectarBles(){
    this.blesService.devices.forEach(
      (d, i) => this.ble.disconnect(d.id).then(
        (res) => {
          this.blesService.devices[i].isConnected = false;
          this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
          console.log("ionViewDidLeave disconnect: ", JSON.stringify(res));
        },
        (error) => console.log("error ionViewDidLeave disconnect: ", JSON.stringify(error)),
      )
    )
  }

  seleccionarPrograma(tipo){
    if (!this.entrenado) return;

    // desseleccionar rutina personalizada
    if (this.tipo == 5 && tipo == 0) this.rutina = [];
    this.tipo = tipo;

    this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
  }

  conectar(device){
    return this.ble.connect(device.id).subscribe(
      (res) => console.log("conectado con conectar: " + JSON.stringify(res)),
      (error) => {
        console.log("desconectado con conectar: " + JSON.stringify(error));
        this.conectar(device);
      }
    );
  }

  writetoDevice(device, color){
    let colorHex = HEX[color];

    if (this.pendiente) {
      return;
    }
    this.presentLoading("Cargando...");
    this.ble.isConnected(device.id).then(
      (res) => {
        console.log("isConnected: " + JSON.stringify(res));
        console.log("NOMBRE: "+device.name)
        /*if(this.platform.is('ios')){
          this.semaforo = true
        }*/
        let code = this.decimalToHex(device.name.substring(6,8), 4) + ";" + this.decimalToHex(device.name.substring(8,10), 2) + ";03;00000000" + colorHex + "020101\n";
        console.log("CODE "+code)
        this.ble.write(device.id, "ffe0", "ffe1", this.stringToBytes(code)).then(
          (res) => {
            this.pendiente = true;
            this.rutina.push({inicio: new Date(), fin: null, total: null});
            console.log("se envio: " + JSON.stringify(res))
            this.lastDevice = device;
            this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
          }
        )
        this.escucharDevices(device);
      }, (error) => console.log("en este caso deberia hacer la funcion recursiva: " + device.id)
    );
  }

  writetoDeviceEstatic(device, color){
    let colorHex = HEX[color];

    if (this.lastDevice != null) {
      // if para poner en negro el antiguo dispositivo
      this.ble.isConnected(this.lastDevice.id).then(
        (res) => {
          console.log("isConnected lastDevice: " + JSON.stringify(res));
          let code = this.decimalToHex(this.lastDevice.name.substring(6,8), 4) + ";" + this.decimalToHex(this.lastDevice.name.substring(8,10), 2) + ";04;00000000000000" + "000000\n";
          

          this.ble.write(this.lastDevice.id, "ffe0", "ffe1", this.stringToBytes(code)).then(
            (res) => {
              //this.ble.disconnect(this.lastDevice.id).then((res) => console.log("desconectado" + res));
              this.rutina[this.rutina.length - 1].fin = new Date();
              this.rutina[this.rutina.length - 1].total = this.rutina[this.rutina.length - 1].fin - this.rutina[this.rutina.length - 1].inicio;
            }
          )
        }, (error) => console.log("en este caso deberia hacer la funcion recursiva: " + device.id)
      );
    }


    this.presentLoading("Cargando...");
    this.ble.isConnected(device.id).then(
      (res) => {
        console.log("isConnected ce: " + JSON.stringify(res));
        let code = this.decimalToHex(device.name.substring(6,8), 4) + ";" + this.decimalToHex(device.name.substring(8,10), 2) + ";04;00000000000000" + colorHex + "\n";
        

        this.ble.write(device.id, "ffe0", "ffe1", this.stringToBytes(code)).then(
          (res) => {
            this.rutina.push({inicio: new Date(), fin: null, total: null})
            this.lastDevice = device;
            this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
          }
        )
      }, (error) => console.log("en este caso deberia hacer la funcion recursiva: " + device.id)
    );
  }

  escucharDevices(device){
    this.bleNotificaciones = this.ble.startNotification(device.id, "ffe0", "ffe1")
    this.bleNotificaciones.subscribe(
      (buffer) => {
        
        let data = this.bytesToString(buffer)
        console.log("ESCUCHAR DEVICE: "+JSON.stringify(data))
        console.log("DEVICE: "+data)
        console.log("BUFFER "+JSON.stringify(buffer))
        let data2 = JSON.stringify(data)
        let num = parseInt(data2[12])

        if(this.platform.is('ios')){
          this.semaforo = !this.semaforo
          console.log("SEMAFORO "+this.semaforo)
          if(this.semaforo == true){
            console.log("MUESTRO cambio")
            //this.ble.disconnect(device.id).then((res) => console.log("desconectado" + res));
            this.rutina[this.rutina.length - 1].fin = new Date();
            this.rutina[this.rutina.length - 1].total = this.rutina[this.rutina.length - 1].fin - this.rutina[this.rutina.length - 1].inicio;
            this.pendiente = false;
            this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista

            if (this.tipo == 3)
              this.randomPrograma();

            if (this.tipo == 5)
              this.iniciarPersonalizada();           
            
          }

        }else if (num != 0) {
          console.log("desconectado ANDROID")
          //this.ble.disconnect(device.id).then((res) => console.log("desconectado" + res));
          this.rutina[this.rutina.length - 1].fin = new Date();
          this.rutina[this.rutina.length - 1].total = this.rutina[this.rutina.length - 1].fin - this.rutina[this.rutina.length - 1].inicio;
          this.pendiente = false;
          this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista

          if (this.tipo == 3)
            this.randomPrograma();

          if (this.tipo == 5)
            this.iniciarPersonalizada();

        }
      }
    )
  }

  terminarEstatica(){
    if (this.lastDevice == null)
    return this.terminarRutina();

    // para poner en negro el ultimo dispositivo
    this.ble.isConnected(this.lastDevice.id).then(
      (res) => {
        console.log("isConnected lastDevice: " + JSON.stringify(res));
        let code = this.decimalToHex(this.lastDevice.name.substring(6,8), 4) + ";" + this.decimalToHex(this.lastDevice.name.substring(8,10), 2) + ";04;00000000000000" + "000000\n";
        

        this.ble.write(this.lastDevice.id, "ffe0", "ffe1", this.stringToBytes(code)).then(
          (res) => {
            this.rutina[this.rutina.length - 1].fin = new Date();
            this.rutina[this.rutina.length - 1].total = this.rutina[this.rutina.length - 1].fin - this.rutina[this.rutina.length - 1].inicio;

            this.terminarRutina();
          }
        )
      }, (error) => console.log("isConnected error: " + this.lastDevice.name)
    );

  }

  limpiarDatos(){
    this.lastDevice = null;
    this.entrenado = null;
    this.rutina = [];
    this.rutinaPersonalizada = [];
    this.acciones = 20;
    this.tipo = 0;
    this.changeDetectorRef.detectChanges(); // esto deberia forzar detectar los cambios en mi vista
  }

  terminarRutina(){
    if(this.pendiente || ![1,2,3,5].includes(this.tipo) || !this.entrenado)
    return false

    if(this.tipo == 2)
    return this.limpiarDatos();

    console.log("termino rutina: ", JSON.stringify(this.rutina));

    let mejor = this.rutina.reduce((acc, loc) => acc.total < loc.total ? acc: loc).total;
    let peor = this.rutina.reduce((acc, loc) => acc.total > loc.total ? acc: loc).total;
    let sum = 0;
    this.rutina.forEach((i)=> sum += i.total);
    let promedio = sum / (this.rutina.length);
    let total_pasos = this.rutina.length;
    let tiempo_total = this.rutina[this.rutina.length - 1].fin - this.rutina[0].inicio;
    let data: object = null;

    if(this.tipo == 1 || this.tipo == 3){
      const tipo = this.tipo == 1 ? "manual" : this.tipo == 3 ? "aleatorio" : null;
      data = {
        promedio,
        mejor,
        peor,
        tiempo_total,
        total_pasos,
        tipo,
        user_id: this.entrenado.id,
        rutina_id: "cualquier cosa",
      }
    }
    else {
      data = {
        promedio,
        mejor,
        peor,
        tiempo_total,
        total_pasos,
        user_id: this.entrenado.id,
        rutina_id: this.rutinaPersonalizada.id,
      }
    }

    console.log("data :", JSON.stringify(data));

    this.presentLoading("Terminando rutina...");
    this.restService.envioEstadisticas(data).then(
      (res) => {
        console.log("header envioEstadisticas: ", res.headers);
        console.log("envioEstadisticas: ", res.data);
        const header = res.headers;
        const data = JSON.parse(res.data);
        if (data.status == "ok"){
          this.limpiarDatos();
          this.confirmacionAlert();
        }
      },
      (error) => console.log("envioEstadisticas error: ", JSON.stringify(error))
    );

  }

  // for random mode
  accionesChange(event){
    this.acciones = event.target.value;
  }

  coloresF(color){
    if (this.colores.includes(color)) {
      this.colores = this.colores.filter((i) => i != color)
    }
    else {
      this.colores.push(color);
    }
  }

  randomPrograma(){
    if(this.rutina.length < this.acciones){
      let device = this.blesService.devices[Math.floor(Math.random() * this.blesService.devices.length)];
      let color = this.colores[Math.floor(Math.random() * this.colores.length)];
      this.writetoDevice(device, color);
      this.presentLoading("Cargando...");
    }
    else{
      return;
    }
  }

  crearRutina(){
    this.router.navigate(['tabs/programaTab/crear-rutina']);
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Actualmente no tiene dispositivos vinculados.',
      backdropDismiss: false,
      buttons: [{
        text: 'Vincular',
        handler: () => {
          this.router.navigate(['tabs']);
        }
      }]
    });

    await alert.present();
  }
  async popupDesactivado() {
    const alert = await this.alertController.create({
      header: 'Atención',
      message: 'Pronto...',
      backdropDismiss: false,
      buttons: [{
        text: 'ok'
      }]
    });

    await alert.present();
  }
  async confirmacionAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Se enviaron los datos a la web, elija otra rutina',
      backdropDismiss: false,
      buttons: [{
        text: 'ok',
        handler: () => {
        }
      }]
    });

    await alert.present();
  }

  async presentLoading(texto) {
    const loading = await this.loadingController.create({
      message: texto,
      duration: 300
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  stringToBytes(string) {
    var array = new Uint8Array(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
     array[i] = string.charCodeAt(i);
    }
    return array.buffer;
  }

  bytesToString(buffer) {
    return String.fromCharCode.apply(null, new Uint8Array(buffer));
  }

  decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
  }

}
