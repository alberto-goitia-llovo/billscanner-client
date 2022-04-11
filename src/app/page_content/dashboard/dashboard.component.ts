import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [
  ]
})
export class DashboardComponent implements OnInit {

  inputData: any[] = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Mary' },
    { id: 3, name: 'Mike' },
    { id: 4, name: 'Peter' },
  ]

  filter = { city: 'barcelona', chain: 'melia' };

  constructor() { }

  ngOnInit(): void {
    console.log('DASHBOARD STARTED')
  }

  changeData(): void {
    this.inputData = [
      { id: 1, name: 'pepito' },
    ]
  }

}
