import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-child2',
  templateUrl: './child2.component.html',
  styles: [
  ]
})
export class Child2Component implements OnInit {

  @Input() filter: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('CHANGES IN CHILD 2!')
  }

}
