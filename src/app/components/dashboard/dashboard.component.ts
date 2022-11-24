import { Component, OnInit } from '@angular/core';
import {ServicioService} from "../../Servicios/servicio.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  nombre='';

  constructor(private _servicioService: ServicioService) { }

  ngOnInit(): void {
  }

  registrarServicio(){

    // @ts-ignore
    const nombreS = document.getElementById("nombreCategoria").value;

    // @ts-ignore
    const descripcionS = document.getElementById("descripcionCategoria").value;

    const servicio = {
      nombreServicio: nombreS.toString(),
      descripcion_servicio: descripcionS.toString()
    }

    this._servicioService.crearServicio(servicio)
      .then((res) => {
        console.log('RES ', res)
      }).catch((err) => {
      console.log(err.name);
      console.log(err.status);
    });

  }

}
