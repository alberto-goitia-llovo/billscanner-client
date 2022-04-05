import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styles: [
  ]
})
export class UploadFileComponent implements OnInit {

  constructor(private messageService: MessageService) { }

  file: File | null
  FILE_SIZE_LIMIT = 50; //Mb
  FILE_TYPE = "text/csv";

  ngOnInit(): void {

  }

  onFileChange(file: File) {
    this.file = file;
    console.log('this.file', this.file)
    let wrongtype = this.file.type != this.FILE_TYPE;
    let toobig = this.file.size > this.FILE_SIZE_LIMIT * 1024 * 1024;
    if (wrongtype) this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'File type is not supported, .csv files only' });
    if (toobig) this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'File size is too big' });
    if (wrongtype || toobig) {
      this.discardFile();
      return;
    }

    this.messageService.add({ key: 'tst', severity: 'info', summary: 'File Uploaded', detail: '' });
  }

  discardFile() {
    this.file = null;
  }

}
