import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import {MatButtonModule} from "@angular/material/button";
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import {FileUploadModule} from 'primeng/fileupload';
import {HttpClientModule} from '@angular/common/http';
import {UsuarioCrudService} from "./components/services/usuario-crud.service";
import {TabViewModule} from 'primeng/tabview';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DashboardComponent,
    SignUpComponent,
    PagenotfoundComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    FileUploadModule,
    HttpClientModule,
    TabViewModule,
    ToastModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    UsuarioCrudService,
    MessageService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
