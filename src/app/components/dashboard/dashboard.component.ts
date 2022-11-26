import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiciosService} from "../services/servicios-crud/servicios.service";
import {TokenService} from "../services/token/token.service";
import {SubastaCrudService} from "../services/subasta/subasta-crud.service";
import {ClienteCrudService} from "../services/cliente/cliente-crud.service";
import {Subastas} from "../../models/subastas";

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
  // @ts-ignore
  subastasBD: Subastas[] = [];

  constructor(private _messageService: MessageService,
              private _formBuilder: FormBuilder,
              private _servios: ServiciosService,
              private _tokenService: TokenService,
              private _subastaCrudService: SubastaCrudService,
              private _clienteCrudService: ClienteCrudService) {
  }

  ngOnInit(): void {
    this.crearFormSubasta();
    this.obtenerServicios();
    this.obtenerSubastas();
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

    let cliente;
    this._clienteCrudService.filtrarCliente(this._tokenService.getUserName()).then(res => {
      cliente = res[0].id_persona;
      const nuevaSubasta = {
        tituloSubasta: tituloSubasta,
        horaCierreSubasta: horaCierreSubasta,
        fechaInicio: fechaInicioSubasta,
        fechaFin: fechaFinSubasta,
        estadoSubasta: "Abierta",
        descripcionSubasta: descripcionSubasta,
        imgSubasta: imagenSubasta,
        cliente: {
          id_persona: cliente
        },
        servicio: {
          idServicio: servioSolicitado.id
        }
      }

      this._subastaCrudService.crearSubasta(nuevaSubasta).then(res => {
        this.addSingle('Subasta generada correctamente', 'success', 'Registro Subasta');
      }).catch(err => {
        this.addSingle(err.message, 'error', 'Error');
      })
    }).catch(err => {
      this.addSingle(err.message, 'error', 'Error');
    })
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
    });
  }

  obtenerSubastas(): void {
    this._subastaCrudService.obtenerSubasta().then(res => {
      this.subastasBD = res;
      console.log(this.subastasBD[0].tituloSubasta);
      // res.forEach((item: any) =>{
      //   // @ts-ignore
      //   this.subastasBD.push(item);
      // })
    }).catch(err => {
      this.addSingle(err.message, 'error', 'Error');
    });
  }


  addSingle(message: string, severity: string, summary: string) {
    this._messageService.add({severity: severity, summary: summary, detail: message});
  }

  cerrarSesion(): void {
    this._tokenService.logOut();
    window.location.reload();
  }

}
