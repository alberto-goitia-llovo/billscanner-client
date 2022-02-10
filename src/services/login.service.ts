import { Injectable } from '@angular/core';
import { RestService } from './rest.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private rest: RestService,
    private alerter: AlertService
  ) { }

  async signin(email: string, password: string): Promise<void> {
    console.log('email', email)
    console.log('password', password)
    console.log("Requesting access");
    try {
      return;
    } catch (error) {
      //TODO: hacer un servicio que haga un pop-up de error
      alert(error);
    }
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    try {
      let result = await this.rest.post('/api/auth/signup', { name, email, password });
      console.log('result', result)
    } catch (error) {
      console.log('error', error)
      //TODO: hacer un servicio que haga un pop-up de error
      this.alerter.popAlert("ERROR", false);
    }
  }
}
