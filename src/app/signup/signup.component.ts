import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../services/app.config.service';
import { IAppConfig } from '../../interfaces/appconfig.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api'
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
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
export class SignupComponent implements OnInit, OnDestroy {

  config: IAppConfig;
  subscription: Subscription;

  //p-password has some styling issues when used in an angular form (the toggleMask icon does not look right)
  signupForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required]),
  });

  constructor(
    public configService: ConfigService,
    public router: Router,
    public authService: AuthService,
    public messageService: MessageService,
  ) { }

  ngOnInit(): void {
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

  signup() {
    this.authService.signup(this.signupForm.controls.name.value, this.signupForm.controls.email.value, this.signupForm.controls.password.value).subscribe((data) => {
      if (data) {
        this.router.navigate(['pages']);
      }
    })
  }

}
