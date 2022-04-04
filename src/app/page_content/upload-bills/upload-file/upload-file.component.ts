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

  fileName: string

  ngOnInit(): void {

  }

  onFileChange(fileName: string) {
    this.fileName = fileName;
    this.messageService.add({ key: 'tst', severity: 'info', summary: 'File Uploaded', detail: fileName });
  }

}
