import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  constructor() { }

  routeItems: MenuItem[];

  ngOnInit(): void {
    this.routeItems = [
      { label: 'Signin', routerLink: 'signin' },
      { label: 'Signup', routerLink: 'signup' },
    ];
  }


}
