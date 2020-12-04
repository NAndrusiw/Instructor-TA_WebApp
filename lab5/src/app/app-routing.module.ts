import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import {LoginComponent} from "./login/login.component";
import {SignUpFormComponent} from "./sign-up-form/sign-up-form.component";

const routes: Routes = [
  {
    path: "login", component: LoginComponent,
  },
  {
    path: "", component: HomeComponent,
  },
  {
    path: "register", component: SignUpFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
