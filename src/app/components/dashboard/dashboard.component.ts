import {Component, OnInit} from '@angular/core';
import {MessageService} from "primeng/api";
import {FormBuilder, Validators} from "@angular/forms";
import {ServiciosService} from "../services/servicios-crud/servicios.service";
import {TokenService} from "../services/token/token.service";
import {SubastaCrudService} from "../services/subasta/subasta-crud.service";
import {ClienteCrudService} from "../services/cliente/cliente-crud.service";
import {Subastas} from "../../models/subastas";
import {LoginUsuario} from "../../models/login-usuario";
import {ProveedorCrudService} from "../services/proveedor/proveedor-crud.service";
import {OfertaCrudService} from "../services/oferta/oferta-crud.service";

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
  responsiveOptions: any;
  formNuevaSubasta: any;
  formNuevaOferta: any;
  isValorOferta = true;
  displayModal = false;
  rol: string ='';
  mostrarAnimacionCarga = false;
  serviciosBD: Servicio[] = [];
  // @ts-ignore
  subastasBD: Subastas[] = [];
  subastaSelected: Subastas[] = [];
  subastaEstado : Subastas[] =[];
  ofertasAcomuladas: [] = [];
  ofertasPorSubasta: any[] = [];

  dataUsuario: [] = [];

  posicionDialogOferta = 'right';
  mostrarDialogOferta = false;
  nombreUserLog: string = '';
  fechaActual: string = new Date().toLocaleDateString('es-es', {year:"numeric", month:"numeric" ,day:"numeric"});

  constructor(private _messageService: MessageService,
              private _formBuilder: FormBuilder,
              private _servios: ServiciosService,
              private _tokenService: TokenService,
              private _subastaCrudService: SubastaCrudService,
              private _clienteCrudService: ClienteCrudService,
              private _proveedroCrudService: ProveedorCrudService,
              private _ofertaCrudService: OfertaCrudService) {
  }

  ngOnInit(): void {
    //Colocar if para validar rol usuario ROLE_CLIENTE ROLE_PROVEEDOR ROLE_ADMIN
    switch (this._tokenService.getAuthorities()[0]){
      case 'ROLE_CLIENTE':
        this.rol = 'cliente';
        this.obtenerDataCliente();
        this.obtenerSubastasEstado();
        this.responsiveOptions = [
          {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
          },
          {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
          },
          {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
          }
        ];
        break;
      case 'ROLE_PROVEEDOR':
        this.rol = 'proveedor';
        this.obtenerDataProveedor();
        break;
      case 'ROLE_ADMIN':
        this.rol = 'admin';
        break;
    }
    this.obtenerOfertas();
    this.crearFormSubasta();
    this.crearFormOferta();
    this.obtenerServicios();
    this.obtenerSubastas();
  }

  // * TODO ClIENTE
  crearFormSubasta(): void {
    this.formNuevaSubasta = this._formBuilder.group({
      tituloSubasta: ['', [Validators.required]],
      descripcionSubasta: ['', [Validators.required]],
      fechaInicioSubasta: ['', [Validators.required]],
      fechaFinSubasta: ['', [Validators.required]],
      servioSolicitado: ['', [Validators.required]],
      horaCierreSubasta: ['', [Validators.required]],
      imagenSubasta: ['', []]
    });
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
        estadoSubasta: 'Iniciada',
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

  verOfertas(data : any): void{
    this.ofertasPorSubasta = [];
    this.mostrarDialogOferta = true;
    this.ofertasAcomuladas.forEach(item =>{
      // @ts-ignore
      if (item.subasta.idSubasta === data.idSubasta){
        this.ofertasPorSubasta.push(item);
      }
    });
    // @ts-ignore
    console.log(this.ofertasPorSubasta)
  }

  // * TODO PROVEEDOR
  crearFormOferta(): void{
    this.formNuevaOferta = this._formBuilder.group({
      precioOferta: ['', [Validators.required]],
    });
  }

  ofertarSubasta(): void{
    this.mostrarAnimacionCarga = true;
    let proveedor;
    let oferta;
    this._proveedroCrudService.filtrarProveedor(this._tokenService.getUserName()).then(res =>{
      proveedor = res[0].id_persona;
      oferta = {
        percioOferta: this.formNuevaOferta.get('precioOferta').value,
        fecha: new Date(),
        comentario_calificacion_oferta: "",
        estado: false,
        calificacion: 0,
        proveedor: {
          id_persona: proveedor
        },
        subasta: {
          idSubasta: Object.values(this.subastaSelected)[0]
        }
      };
      console.log(oferta);
      this._ofertaCrudService.crearOferta(oferta).then(res =>{
        this.addSingle('Oferta realizada con exito.', 'success', 'Ofertar');
        this.mostrarAnimacionCarga = false;
        this.displayModal = false;
      }).catch(err =>{
        this.addSingle('Error al tratar de realizar oferta.', 'error', 'Error al ofertar');
        this.mostrarAnimacionCarga = false;
      })
    }).catch(err =>{
      console.log('ERR ', err)
    });
  }

  // * TODO OBTENER DATA BACK
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
    }).catch(err => {
      this.addSingle(err.message, 'error', 'Error');
    });
  }

  obtenerDataCliente(): void{
    this._clienteCrudService.filtrarCliente(this._tokenService.getUserName()).then(res =>{
      this.dataUsuario = res[0];
      // @ts-ignore
      this.nombreUserLog = this.dataUsuario.nombre+' '+this.dataUsuario.apellido;
    }).catch(err =>{
      this.addSingle(err.message, 'error', 'Error');
    })
  }

  obtenerDataProveedor(): void{
    this._proveedroCrudService.filtrarProveedor(this._tokenService.getUserName()).then(res =>{
      this.dataUsuario = res[0];
      // @ts-ignore
      this.nombreUserLog = this.dataUsuario.nombre+' '+this.dataUsuario.apellido;
    }).catch(err =>{
      this.addSingle(err.message, 'error', 'Error');
    })
  }

  obtenerSubastasEstado(): void{
    this._subastaCrudService.filtrarSubasta('Iniciada').then(res =>{
      // @ts-ignore
      res.forEach(subasta =>{
        // @ts-ignore
        if (subasta.cliente.id_persona === this.dataUsuario.id_persona){
          this.subastaEstado.push(subasta);
        }
      })
    }).catch(err =>{
      this.addSingle(err.message, 'error', 'Error');
    })
  }

  obtenerOfertas(): void{
    this._ofertaCrudService.obtenerOferta().then(res =>{
      // @ts-ignore
      res.forEach(oferta =>{
        // @ts-ignore
        this.ofertasAcomuladas.push(oferta);
      })
    }).catch(err =>{
      console.log(err);
    });
  }

  // * TODO GENERALES
  observarPrecioOferta(): void{
    console.log('HOLA')
    if (this.formNuevaOferta.get('precioOferta').value === null){
      this.isValorOferta = true;
    }else {
      this.isValorOferta = false;
    }
  }

  observarSubastaSelected(subasta: any){
    this.subastaSelected = subasta;
    this.displayModal = true;
  }

  addSingle(message: string, severity: string, summary: string) {
    this._messageService.add({severity: severity, summary: summary, detail: message});
  }

  cerrarSesion(): void {
    this._tokenService.logOut();
    window.location.reload();
  }

  cerrarDialogoOferta(): void{
    this.formNuevaOferta.get('precioOferta').setValue(' ');
  }

}
