import { Component, OnInit } from '@angular/core';
import {UsuarioCrudService} from "../services/usuario-crud.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  nombre='';

  constructor(private _usuarioCrudService: UsuarioCrudService) { }

  ngOnInit(): void {
  }

  registrarUsuario(){
    // @ts-ignore
    const nombreP = document.getElementById("fristname").value;
    // @ts-ignore
    const apellidoP = document.getElementById("lastname").value;
    // @ts-ignore
    const email = document.getElementById("email").value;
    // @ts-ignore
    const direccionP = document.getElementById("address").value;
    // @ts-ignore
    const telefonoP = document.getElementById("telephone").value;
    // @ts-ignore
    const experienciaP = document.getElementById("experience").value;
    // @ts-ignore
    const userP = document.getElementById("username").value;
    // @ts-ignore
    const passwordP = document.getElementById("password").value;

    const user = {
      nombre: nombreP.toString(),
      apellido: apellidoP.toString(),
      email: email.toString(),
      telefono: telefonoP.toString(),
      direccion: direccionP.toString(),
      anios_experiencia: experienciaP,
      usuario: {
        nombreUsuario: userP.toString(),
        contraseniaUsuario: passwordP.toString()
      }
    }

    this._usuarioCrudService.crearUsuarioProveedor(user)
      .then((res) => {
        console.log('RES ', res)
      }).catch((err) => {
      console.log(err.name);
      console.log(err.status);
    });

    this._usuarioCrudService.getUsers();
  }
}
