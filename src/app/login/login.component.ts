import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private login: LoginService,
  ) { }

  ngOnInit(): void {
  }

  async singin(email: string, password: string): Promise<void> {
    await this.login.singin(email, password);
  }

}
