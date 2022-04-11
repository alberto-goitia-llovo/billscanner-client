import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
})
export class ChildComponent implements OnInit {

  @Input() data: any;
  @Input() filter: any;
  @Output() filterChange = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGES IN CHILD1!')
    console.log(changes);
  }

  changeFilter(): void {
    this.filter = { city: 'new york', chain: 'hilton' };
    this.filterChange.next(this.filter);
  }

}
