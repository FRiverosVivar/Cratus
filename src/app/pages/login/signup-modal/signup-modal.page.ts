import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest/rest.service';
import { AlertController } from '@ionic/angular';
import { LoadingController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { COUNTRY_REGION } from 'src/assets/datas/country_region';

@Component({
  selector: 'app-signup-modal',
  templateUrl: './signup-modal.page.html',
  styleUrls: ['./signup-modal.page.scss'],
})
export class SignupModalPage implements OnInit {

  public registroForm: FormGroup;
  private isOpen: boolean = false;

  public paises = COUNTRY_REGION;
  public regiones = [];
  public status = 0;

  constructor(
    private modal: ModalController,
    private formBuilder: FormBuilder,
    private router: Router,
    public restService: RestService,
    public alertController: AlertController,
    public loadingController: LoadingController,
    private iab: InAppBrowser,
  ) {
  }

  ngOnInit() {
    this.registroForm = this.formBuilder.group({
      nombre: ['', Validators.required],
      apellidos: ['', Validators.required],
      rut: ['', [Validators.required]],
      sexo: ['', [Validators.required]],
      nacionalidad: ['', [Validators.required]],
      pais_residencia: [null, [Validators.required]],
      region_residencia: [null, [Validators.required]],
      //
      altura: ['', [Validators.required]],
      peso: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      fecha_nacimiento: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', Validators.required],
      passwordverify: ['', [Validators.required]],
      term: [false, Validators.pattern('true')],
      polis: [false, Validators.pattern('true')],
    }, { // Validaciones
    });
  }

  ionViewDidEnter() {
    this.isOpen = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.registroForm.controls; }

  openBrowser(url){
    const browser = this.iab.create(url);

    browser.on('loadstop').subscribe(event => {
    });
  }

  registrar(){

    console.log(JSON.stringify(this.registroForm.value));


    if (this.registroForm.status == "INVALID")
      return console.log("formulario invalido, revise errores: ")

    // registrar con fetch

    this.presentLoading();

    this.restService.signup(this.registroForm.value).then(
      (res) => {
        let data = JSON.parse(res.data)
        console.log("signup: ", res.data, data.status)

        if (data.status == "success") {
          return this.confirmationAlert();
        }
        else {
          return this.errorAlert();
        }
      },
      (error) => {
        this.errorAlert();
        console.log("error signup: ", JSON.stringify(error))
      }
    );

  }

  async cancel(){
    if (this.isOpen) {
      await this.modal.dismiss();
    }
  }

  onCheckboxChange(event){
    console.log("nani");
  }

  async confirmationAlert() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Cuenta creada con exito!',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.modal.dismiss();
          }
        }
      ]
    });

    await alert.present();
  }

  async errorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Error al crear cuenta, intentelo de nuevo',
      buttons: [
        {
          text: 'OK',
          handler: () => {
          }
        }
      ]
    });

    await alert.present();
  }

  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'cargando...',
      duration: 1000
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();
  }

  seleccionPais(): void {
    let pais  = this.registroForm.get('pais_residencia').value;
    console.log("pais_residencia: ", JSON.stringify(pais));
    this.regiones = pais['regions'];
  }

  continuar(){
    this.status = 1;
  }

}
