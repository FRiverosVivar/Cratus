import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { RestService } from 'src/app/services/rest/rest.service';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private restService: RestService,
    private storage: Storage,
    private screenOrientation: ScreenOrientation,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      // allow user rotate
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.screenOrientation.unlock();
      //this.restService.removeSession();
      this.storage.get('session').then((res) => {
        if(!!res) {
          this.router.navigate(['/tabs'], {replaceUrl: true});
          console.log("nani: ", JSON.stringify(res));
        }
        else {
          this.router.navigate(['/login'], {replaceUrl: true});
        }
        this.splashScreen.hide();
      });
    });
  }
}
