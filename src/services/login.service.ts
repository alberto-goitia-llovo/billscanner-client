import { Injectable } from '@angular/core';
import { RestService } from 'src/services/rest.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private rest: RestService,
  ) { }

  async singin(email: string, password: string): Promise<void> {
    console.log('password', password)
    console.log('email', email)
    console.log("Requesting access");
    try {
      return;
      let result = await this.rest.
        get('/api/auth/signin', { email, password });
      console.log('result', result)
    } catch (error) {
      //TODO: hacer un servicio que haga un pop-up de error
      alert(error);
    }
  }
}
