import { Component, OnInit } from '@angular/core';
import {UsuarioCrudService} from "../services/usuario-crud.service";
import {MessageService} from 'primeng/api';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";


@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  formRegistroUsuario: any;

  constructor(private _usuarioCrudService: UsuarioCrudService,
              private _messageService: MessageService,
              private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.crearFormularioRegistro();
  }

  crearFormularioRegistro(){

    //const formRegistroUsuario;
    this.formRegistroUsuario = this._formBuilder.group({
      nombrePersona: ['', [Validators.required]],
      apellidoPersona: ['', [Validators.required]],
      emailPersona: ['', [Validators.required]],
      direccionPersona: ['', [Validators.required]],
      telefonoPersona: ['', [Validators.required]],
      aniosExpProveedor: ['', [Validators.required]],
      nombreUsuario: ['', [Validators.required]],
      contraseniaUsuario: ['', [Validators.required]],
    })
  }

  registrarUsuario(){
    // @ts-ignore
    const nombreP = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const apellidoP = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const email = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const direccionP = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const telefonoP = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const experienciaP = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const userP = this.formRegistroUsuario.get('nombrePersona').value;
    // @ts-ignore
    const passwordP = this.formRegistroUsuario.get('nombrePersona').value;

    const user = {
      nombre: nombreP,
      apellido: apellidoP,
      email: email,
      telefono: telefonoP,
      direccion: direccionP,
      anios_experiencia: experienciaP,
      usuario: {
        nombreUsuario: userP,
        contraseniaUsuario: passwordP
      }
    }

    // this._usuarioCrudService.crearUsuarioProveedor(user)
    //   .then((res) => {
    //     this._usuarioCrudService.getUsers();
    //     this.addSingle(res.mensaje);
    //   }).catch((err) => {
    //   console.log(err.name);
    //   console.log(err.status);
    // });


    //this.addSingle();
  }
  addSingle(message: string) {
    this._messageService.add({severity:'success', summary:'Registro Exitoso', detail:message});
  }
}
