import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { AppMainComponent } from './page_layout/app.main.component';
import { DashboardComponent } from './page_content/dashboard/dashboard.component';
import { CategoriesComponent } from './page_content/categories/categories.component';
import { AccountsComponent } from './page_content/accounts/accounts.component';
import { ObjectivesComponent } from './page_content/objectives/objectives.component';
import { LedgerComponent } from './page_content/ledger/ledger.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'pages', component: AppMainComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ledger', component: LedgerComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'accounts', component: AccountsComponent },
      { path: 'objectives', component: ObjectivesComponent },
    ]
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }