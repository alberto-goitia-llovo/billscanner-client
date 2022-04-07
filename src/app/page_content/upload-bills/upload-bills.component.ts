import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CsvService, delimiterType, decimalSeparatorType } from '../../../services/csv.service';

@Component({
  selector: 'app-upload-bills',
  templateUrl: './upload-bills.component.html',
  styles: [
  ]
})
export class UploadBillsComponent implements OnInit {

  constructor(
    private messageService: MessageService,
    private csvService: CsvService
  ) { }

  file: File | null
  FILE_SIZE_LIMIT = 50; //Mb
  FILE_TYPE = "text/csv";

  delimiter: delimiterType = ";";
  decimalSeparator: decimalSeparatorType = ",";

  ngOnInit(): void {

  }

  onFileChange(file: File) {
    console.log('file', file)
    let wrongtype = file.type != this.FILE_TYPE;
    let toobig = file.size > this.FILE_SIZE_LIMIT * 1024 * 1024;
    if (wrongtype) this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'File type is not supported, .csv files only' });
    if (toobig) this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'File size is too big' });
    if (wrongtype || toobig) {
      this.discardFile();
      return;
    }
    this.file = file;
    this.messageService.add({ key: 'tst', severity: 'info', summary: 'File Uploaded', detail: '' });
    this.readFile(file);
  }

  discardFile() {
    this.file = null;
  }

  downloadTemplate() {
    let link = document.createElement('a');
    link.download = "template.csv";
    link.href = "assets/files/template.csv";
    link.click();
  }

  readFile(file) {
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      const csv = reader.result;
      let result = this.csvService.parse(csv, this.delimiter);
      let validation_result = this.csvService.validate(result);
      console.log('result', result)
    }
  }

}
