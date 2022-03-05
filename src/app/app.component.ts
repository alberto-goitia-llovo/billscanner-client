import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'billscanner-client';
  constructor(
    public auth: AuthService,
    private router: Router
  ) { }

  tosheetreader() {
    this.router.navigate(['/sheet-reader']);
  }

  towelcome() {
    this.router.navigate(['/welcome']);
  }
}

