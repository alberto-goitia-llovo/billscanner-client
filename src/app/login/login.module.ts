import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SigninComponent } from '../signin/signin.component';
import { SignupComponent } from '../signup/signup.component';
import { LoginComponent } from '../login/login.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '', component: LoginComponent, children: [
          { path: '', redirectTo: 'signin', pathMatch: 'full' },
          { path: 'signin', component: SigninComponent },
          { path: 'signup', component: SignupComponent },
        ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class LoginModule { }
