import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';
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
      { path: 'dashboard', component: DashboardComponent },
      { path: 'my-bills', component: MyBillsComponent },
      { path: 'upload-bills', component: UploadBillsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'objectives', component: ObjectivesComponent },
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
