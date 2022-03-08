import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  constructor(
    private router: Router,
    private rest: RestService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.rest.get('/api/test/testdata').subscribe((data: any) => {
      console.log('data', data)
      this.alert.queueAlert(data.data, "info")
    })
  }

  tosheetreader() {
    this.router.navigate(["sheet-reader"]);
  }
}
