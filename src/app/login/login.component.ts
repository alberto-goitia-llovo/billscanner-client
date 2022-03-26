import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../services/app.config.service';
import { AppConfig } from '../../interfaces/appconfig';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [`
    :host ::ng-deep .p-password input {
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

  valCheck: string[] = ['remember'];

  password: string;

  config: AppConfig;

  subscription: Subscription;

  constructor(
    public configService: ConfigService,
    public router: Router
  ) { }

  ngOnInit(): void {
    // this.config = this.configService.config;
    this.config = this.configService.getConfig();
    console.log('this.config', this.config)
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
      console.log("LA CONFIG HA CAMBIADOO EN EL LOGIIN", this.config);
      console.log("LA DEL SERVICIO ES", this.configService.getConfig())
    });
  }

  ngOnDestroy(): void {
    // if (this.subscription) {
    //   this.subscription.unsubscribe();
    // }
  }

  signin() {
    console.log("nos vamos a ", 'pages')
    this.router.navigate(['pages']);
  }

}
