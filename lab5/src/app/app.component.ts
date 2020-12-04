import {Component, OnInit} from '@angular/core';
import {User} from "./services/user.model";
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'lab5';
  user: User;


  constructor(public auth: AuthService) {
    this.auth.user$.subscribe(user$ => this.user = user$);
  }


  ngOnInit(): void {

  }

}
