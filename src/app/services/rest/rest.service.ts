import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http/ngx';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data/data.service';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private url: string;
  private session: {
    token: string,
    client: string,
    uid: string,
    user: any
  };

  constructor(
    private httpAdvance : HTTP,
    private storage: Storage,
    private router: Router,
    private dataService: DataService,
  ) {

    this.url = "https://cratus.herokuapp.com";
    this.url = "https://www.cratusfit.com";


    this.storage.get('session').then((res) => {
      this.session = res;
    });

    
  }

  saveSession(header, data){
    this.session =  {
      token: header['access-token'] ? header['access-token'] : this.session.token,
      client: header.client ? header.client : this.session.client,
      uid: header.uid ? header.uid : this.session.uid,
      user: data,
    }
    console.log("saveSession", JSON.stringify(data));

    return this.storage.set('session', this.session)
  }

  getUser() {
    return this.session.user;
  }

  removeSession() {
    this.storage.remove('session').then((res) => {
      this.session = null;
      this.router.navigate(['/login'], {replaceUrl: true});
    });
  }

  login(user){
    let header = {'Content-Type' : 'application/json'};
    let data = {
      email: user.username,
      password: user.password,
    }
    console.log(JSON.stringify(data), this.url + "/api/auth/sign_in")
    this.httpAdvance.setDataSerializer('json');
    return this.httpAdvance.post(this.url + "/api/auth/sign_in", data , header);
  }

  signup(newuser){
    const data = {
      "nombre": newuser.nombre,
      "apellidos": newuser.apellidos,
      "rut": newuser.rut,
      "sexo": newuser.sexo,
      "nacionalidad": newuser.nacionalidad,
      "pais_residencia": newuser.pais_residencia.countryName,
      "region_residencia": newuser.region_residencia.name,
      "altura": newuser.altura,
      "peso": newuser.peso,
      "telefono": newuser.telefono,
      "fecha_nacimiento": newuser.fecha_nacimiento,
      "email": newuser.email,
      "is_admin": "true",
      "password": newuser.password,
      "password_confirmation": newuser.passwordverify,
    }

    let header = {'Content-Type' : 'application/json'};
    this.httpAdvance.setDataSerializer('json');

    console.log("data: ", JSON.stringify(data));
    this.httpAdvance.setDataSerializer('json');
    return this.httpAdvance.post(this.url + "/api/auth", data , header);
  }

  envioEstadisticas(data){
    console.log(JSON.stringify(this.session))
    let header: any = {
      'Content-Type': 'application/json',
      'access-token': this.session['token'],
      'client': this.session['client'],
      'uid': this.session['uid']
    };
    console.log("envioEstadisticas", JSON.stringify(data),  JSON.stringify(header))

    this.httpAdvance.setDataSerializer('json');

    return this.httpAdvance.post(this.url + "/api/repeticiones", data , header);
  }

  listaEntrenados(){
    let header: any = {
      'Content-Type': 'application/json',
      'access-token': this.session['token'],
      'client': this.session['client'],
      'uid': this.session['uid']
    };
    this.httpAdvance.setDataSerializer('json');
    return this.httpAdvance.get(this.url + "/api/users", {}, header);
  }

  getRutinas(){
    let header: any = {
      'Content-Type': 'application/json',
      'access-token': this.session['token'],
      'client': this.session['client'],
      'uid': this.session['uid']
    };
    this.httpAdvance.setDataSerializer('json');
    return this.httpAdvance.get(this.url + "/api/rutinas", {}, header);
  }

  getRutina(rutina){
    let header: any = {
      'Content-Type': 'application/json',
      'access-token': this.session['token'],
      'client': this.session['client'],
      'uid': this.session['uid']
    };
    this.httpAdvance.setDataSerializer('json');
    return this.httpAdvance.get(this.url + "/api/rutinas/" + rutina.id + "/pasos", {}, header);
  }

  estadisticas(entrenado, rutina){
    let data = {
      'user_id': entrenado.id,
      'rutina_id': rutina.id,
    }
    let header: any = {
      'Content-Type': 'application/json',
      'access-token': this.session['token'],
      'client': this.session['client'],
      'uid': this.session['uid']
    };
    console.log("envioEstadisticas", JSON.stringify(data),  JSON.stringify(header))

    this.httpAdvance.setDataSerializer('json');

    return this.httpAdvance.post(this.url + "/api/lista_repeticiones", data , header);
  }

  crearRutina(rutina, nombre){
    let header: any = {
      'Content-Type': 'application/json',
      'access-token': this.session['token'],
      'client': this.session['client'],
      'uid': this.session['uid']
    };
    let steps = [];

    rutina.forEach(
      (step, i) => steps.push({step: i + 1, dispositivo: step.dispositivo, color: step.color})
    );

    const data = {
      user_id: this.session.user.id,
      nombre: nombre,
      steps: steps.length,
      pasos_attributes: steps,
    };
    // console.log("crearRutina rest: ", JSON.stringify(data));
    this.httpAdvance.setDataSerializer('json');
    return this.httpAdvance.post(this.url + "/api/rutinas", data , header);
  }
}
