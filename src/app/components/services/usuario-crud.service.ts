import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UsuarioCrudService {

  headers = new HttpHeaders().append('Content-Type', 'application/json')

  constructor(private _http: HttpClient) {
  }

  // * TODO CRUD USUARIO PROVEEDOR
  crearUsuarioProveedor(data: any): Promise<any> {
    //console.log(data);
    return this._http.post('http://localhost:9090/proveedor/crear',
      data,
      {
        headers: this.headers
      }
    ).toPromise();
  }

  getUsers(){
    this._http.get('http://localhost:9090/proveedor/listar').subscribe(data => {
      console.log(data);
    });
  }
}
