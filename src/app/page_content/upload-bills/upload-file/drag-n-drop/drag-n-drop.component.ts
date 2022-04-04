import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styles: [`
    #drop-area {
      border: 0.25rem dotted var(--primary-color);
      padding: 4rem;
    }
      #drop-area i {
        font-size: 5rem;
        padding-bottom: 1.5rem;
      } 
  `
  ]
})
export class DragNDropComponent implements OnInit {

  constructor() { }

  @Input() fileName: string
  @Output() fileNameChange: EventEmitter<string> = new EventEmitter();


  ngOnInit(): void {
    this.fileName = "testfile.csv";
  }

  emitFileName() {
    this.fileNameChange.emit(this.fileName);
  }

}
