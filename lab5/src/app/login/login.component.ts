import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  formControls = this.auth.loginForm.controls;

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  // Sign in with email/password
  login() {
    const {email, password} = this.auth.loginForm.value;
    this.auth.signIn(email, password);
    this.auth.loginForm.reset();
  }

}
