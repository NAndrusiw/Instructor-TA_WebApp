import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-sign-up-form',
  templateUrl: './sign-up-form.component.html',
  styleUrls: ['./sign-up-form.component.css']
})
export class SignUpFormComponent implements OnInit {

  formControls = this.auth.registerForm.controls;

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
  }

  register() {
    // this.auth.signUp()
    //  this.auth.registerForm.value;
    this.auth.signUp(this.auth.registerForm.value);
    this.auth.registerForm.reset();

  }



}
