import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from 'src/services/rest.service';
import { AlertService } from 'src/services/alert.service';

@Component({
  selector: 'app-sheet-reader',
  templateUrl: './sheet-reader.component.html',
  styleUrls: ['./sheet-reader.component.css']
})
export class SheetReaderComponent implements OnInit {

  constructor(
    private router: Router,
    private rest: RestService,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.rest.get('/api/test/testdata').subscribe((data: any) => {
      console.log('data', data)
      this.alert.queueAlert(data.data, "info")
    }, err => { console.log(err, 'error') })
  }

  towelcome() {
    this.router.navigate(['/welcome']);
  }

}
