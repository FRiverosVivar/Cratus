import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { LoginPageRoutingModule } from './login-routing.module';
import { LoginPage } from './login.page';
import { LoginModalPage } from './login-modal/login-modal.page';
import { LoginModalPageModule } from './login-modal/login-modal.module';
import { SignupModalPage } from './signup-modal/signup-modal.page';
import { SignupModalPageModule } from './signup-modal/signup-modal.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LoginPageRoutingModule,
    LoginModalPageModule,
    SignupModalPageModule,
  ],
  entryComponents: [LoginModalPage, SignupModalPage],
  declarations: [LoginPage]
})
export class LoginPageModule {}
