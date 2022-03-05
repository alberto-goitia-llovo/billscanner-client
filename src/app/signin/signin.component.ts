import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from 'src/services/auth.service';
import { AlertService } from '../../services/alert.service';
import { Router } from '@angular/router';


/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  constructor(
    private login: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  emailFormControl = new FormControl('', [Validators.required, Validators.email]);
  passwdFormControl = new FormControl('', [Validators.required]);

  matcher = new MyErrorStateMatcher(); //Controls when to trigger the error message


  async signin(): Promise<void> {
    await this.login.signin(this.emailFormControl.value, this.passwdFormControl.value).subscribe((data) => {
      console.log(data);
      if (data) {
        this.router.navigate(["welcome"]);
      }
    })
  }
}


