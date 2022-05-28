import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserLoggedGuard } from '../helpers/userLogged.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { AppMainComponent } from './page_layout/app.main.component';
import { DashboardComponent } from './page_content/dashboard/dashboard.component';
import { CategoriesComponent } from './page_content/categories/categories.component';
import { AccountsComponent } from './page_content/accounts/accounts.component';
import { ObjectivesComponent } from './page_content/objectives/objectives.component';
import { MyBillsComponent } from './page_content/my-bills/my-bills.component';
import { UploadBillsComponent } from './page_content/upload-bills/upload-bills.component';

const routes: Routes = [
  {
    path: 'pages', component: AppMainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, canActivate: [UserLoggedGuard] },
      { path: 'my-bills', component: MyBillsComponent, canActivate: [UserLoggedGuard] },
      { path: 'upload-bills', component: UploadBillsComponent, canActivate: [UserLoggedGuard] },
      { path: 'categories', component: CategoriesComponent, canActivate: [UserLoggedGuard] },
      { path: 'accounts', component: AccountsComponent, canActivate: [UserLoggedGuard] },
      { path: 'objectives', component: ObjectivesComponent, canActivate: [UserLoggedGuard] },
    ]
  },
  { path: 'login', component: LoginComponent, data: { animation: 'LoginPage' } },
  { path: 'signup', component: SignupComponent, data: { animation: 'SignupPage' } },
  { path: '**', redirectTo: 'login' },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
