import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  entrenado = null;
  rutina = null;
  estadisticas = null;

  constructor(
    private storage: Storage,
  ) {
  }

  setEntrenado(entrenado) {
    this.entrenado = entrenado;
  }

  getEntrenado() {
    return this.entrenado;
  }

  setRutina(rutina) {
    this.rutina = rutina;
  }

  getRutina() {
    return this.rutina;
  }

  setEstadisticas(estadisticas) {
    this.estadisticas = estadisticas;
  }

  getEstadisticas() {
    return this.estadisticas;
  }
}
