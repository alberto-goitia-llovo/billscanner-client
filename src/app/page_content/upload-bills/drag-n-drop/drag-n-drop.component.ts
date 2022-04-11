import { Component, OnInit, Output, Input, EventEmitter, HostListener, HostBinding } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-drag-n-drop',
  templateUrl: './drag-n-drop.component.html',
  styles: [`
    #drop-area {
      border: 0.25rem dotted var(--primary-color);
      padding: 4rem;
    }

    #drop-area:hover {
      border: 0.4rem dashed var(--primary-color);;
    }
      #drop-area i {
        font-size: 5rem;
        padding-bottom: 1.5rem;
      } 
  `
  ]
})
export class DragNDropComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  @Input() file: File | null;
  @Output() fileChange: EventEmitter<File> = new EventEmitter();

  ngOnInit(): void {
  }

  handleFileInput(event) {
    this.fileChange.emit(this.file = event.target.files[0]);
    //emptying the input, allowing to upload the same file again
    (<HTMLInputElement>document.getElementById("fileinput")).value = '';
  }

  browseFiles() {
    const input: HTMLElement | null = document.getElementById("fileinput");
    if (input) input.click();
  }

  @HostListener('dragover', ['$event']) public onDragOver(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let element = document.getElementById("drop-area");
    if (element) element.style.border = "0.4rem dashed var(--primary-color)"
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let element = document.getElementById("drop-area");
    if (element) element.style.border = "0.25rem dotted var(--primary-color)"
  }

  @HostListener('drop', ['$event']) public onDrop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let element = document.getElementById("drop-area");
    if (element) element.style.border = "0.25rem dotted var(--primary-color)"
    let files = evt.dataTransfer.files;
    let valid_files: Array<File> = files;
    this.fileChange.emit(valid_files[0]);
  }

}
