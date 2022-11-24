import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Servicio} from "../Models/servicio";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ServicioService {

  /*url: string= 'http://localhost:9090/servicio'
  constructor(private Http:HttpClient) { }

  postServicio(servicio:Servicio):Observable<Servicio>{
    return this.Http.post<Servicio>(this.url+'/crear',servicio);
  }*/

  headers = new HttpHeaders().append('Content-Type', 'application/json')

  constructor(private _http: HttpClient) {
  }

  crearServicio(data: any): Promise<any> {
    //console.log(data);
    return this._http.post('http://localhost:9090/servicio/crear',
      data,
      {
        headers: this.headers
      }
    ).toPromise();
  }


}
