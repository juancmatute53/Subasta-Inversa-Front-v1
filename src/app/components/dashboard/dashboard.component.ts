import { Component, OnInit } from '@angular/core';
import {MessageService} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiciosService} from "../services/servicios-crud/servicios.service";
import {TokenService} from "../services/token/token.service";

interface Servicio {
  name: string,
  descripcion: string
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  formNuevaSubasta: any;
  serviciosBD: Servicio[] = [];

  constructor(private _messageService: MessageService,
              private _formBuilder: FormBuilder,
              private _servios: ServiciosService,
              private _tokenService: TokenService) { }

  ngOnInit(): void {
    this.crearFormSubasta();
    this.obtenerServicios();
  }

  crearFormSubasta(): void {
    this.formNuevaSubasta = this._formBuilder.group({
      tituloSubasta: ['', [Validators.required]],
      descripcionSubasta: ['', [Validators.required]],
      fechaInicioSubasta: ['', [Validators.required]],
      fechaFinSubasta: ['', [Validators.required]],
      servioSolicitado: ['', [Validators.required]],
      horaCierreSubasta: ['', [Validators.required]],
      imagenSubasta: ['', []]
    })
  }

  crearSubasta(): void {
    const tituloSubasta = this.formNuevaSubasta.get('tituloSubasta').value;
    const descripcionSubasta = this.formNuevaSubasta.get('descripcionSubasta').value;
    const fechaInicioSubasta = this.formNuevaSubasta.get('fechaInicioSubasta').value;
    const fechaFinSubasta = this.formNuevaSubasta.get('fechaFinSubasta').value;
    const servioSolicitado = this.formNuevaSubasta.get('servioSolicitado').value;
    const horaCierreSubasta = this.formNuevaSubasta.get('horaCierreSubasta').value;
    const imagenSubasta = this.formNuevaSubasta.get('imagenSubasta').value;

  }

  // * Obtenemo los servicios
  obtenerServicios(): void {
    // * hacemos la peticion al servicio
    this._servios.obtenerServicios().then(res => {
      // @ts-ignore
      // * recorremos el res que nos deja la promesa
      res.forEach(elem => {
        // * Mandamos el objeto con los datos del servicio
        // @ts-ignore
        this.serviciosBD.push({id: elem.idServicio, name: elem.nombreServicio, descripcion: elem.descripcion_servicio});
      });
    }).catch(err => {
      this.addSingle(err.message, 'error', 'Error');
    })
  }


  addSingle(message: string, severity: string, summary: string) {
    this._messageService.add({severity: severity, summary: summary, detail: message});
  }

  cerrarSesion(): void{
    this._tokenService.logOut();
    window.location.reload();
  }

}
