import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { LoginModalPage } from './login-modal/login-modal.page';
import { SignupModalPage } from './signup-modal/signup-modal.page';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private router: Router,
    private modal: ModalController,
  ) {
  }

  ngOnInit() {
  }


  async logear(e) {
    let modal = await this.modal.create({
      component: LoginModalPage
    });
    return await modal.present();
  }

  async registrar(e) {
    let modal = await this.modal.create({
      component: SignupModalPage
    });
    return await modal.present();
  }

}
