import { Component, OnInit } from '@angular/core';
import {AuthService} from "../services/auth.service";
import firebase from "firebase";
import {User} from "../services/user.model";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: User;

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.auth.user$.subscribe(user$ => this.user = user$);
  }

}
