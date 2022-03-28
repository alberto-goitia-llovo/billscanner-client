import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../services/app.config.service';
import { AppConfig } from '../../interfaces/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
      :host ::ng-deep .p-password input {
        width: 100%;
        padding:1rem;
      }

      :host ::ng-deep p-password div>input {
        width: 100%;
        padding:1rem;
      }
    
      :host ::ng-deep .pi-eye{
        transform:scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
      
      :host ::ng-deep .pi-eye-slash{
        transform:scale(1.6);
        margin-right: 1rem;
        color: var(--primary-color) !important;
      }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {
  password: string;

  config: AppConfig;

  email: string;

  subscription: Subscription;

  //p-password has some styling issues when used in an angular form (the toggleMask icon does not look right)
  loginForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(
    public configService: ConfigService,
    public router: Router,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    // this.config = this.configService.config;
    this.config = this.configService.getConfig();
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  signin() {
    this.router.navigate(['pages']);
  }

}
