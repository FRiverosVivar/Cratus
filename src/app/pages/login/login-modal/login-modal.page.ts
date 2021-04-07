import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest/rest.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.page.html',
  styleUrls: ['./login-modal.page.scss'],
})
export class LoginModalPage implements OnInit {

  public loginForm : FormGroup;
  private isOpen : boolean;

  constructor(
    private modal: ModalController,
    private formBuilder: FormBuilder,
    private router: Router,
    private restService: RestService,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', [Validators.required]],
      //password: ['', [Validators.required, Validators.minLength(6)]],
    }, { // Validaciones
    });
  }

  ionViewDidEnter() {
    this.isOpen = true;
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  logear() {

    if (this.loginForm.status == "INVALID")
      return console.log("formulario invalido, revise errores: ")


    this.restService.login(this.loginForm.value).then(
      (res) => {
        console.log("data login : ", res.data)
        let header = res.headers;
        let data = JSON.parse(res.data).data;
        if (res.status == 200) {
          this.restService.saveSession(header, data).then(
            () => this.router.navigate(['/tabs'], {replaceUrl: true})
          );
          this.modal.dismiss();
        }
      },
      (error) => console.log("error "+JSON.stringify(error))
    )
  }

  async cancel(){
    if (this.isOpen) {
      await this.modal.dismiss();
    }
  }

}
