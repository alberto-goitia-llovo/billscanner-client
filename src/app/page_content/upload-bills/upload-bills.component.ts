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

  errors: any[] = [];
  msgs: { severity: string, summary: string, detail: string }[] = [];

  fileready = false;

  ngOnInit(): void {

  }

  async onFileChange(file: File) {
    this.fileready = false;
    let wrongtype = file.type != this.FILE_TYPE;
    let toobig = file.size > this.FILE_SIZE_LIMIT * 1024 * 1024;
    if (wrongtype) this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'File type is not supported, .csv files only' });
    if (toobig) this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'File size is too big' });
    if (wrongtype || toobig) {
      this.discardFile();
      return;
    }
    this.file = file;
    let fileObject = await this.readFile(file);
    if (fileObject) {
      await this.upload(fileObject);
      this.msgs = [];
      this.msgs.push({ severity: 'success', summary: 'Upload', detail: 'The file was uploaded successfully' });
    }
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
    return new Promise((resolve) => {
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        try {
          const csv = reader.result;
          let result = this.csvService.parse(csv, this.delimiter);
          //TODO: add custom date format, csv delimiter and decimal separator
          let { convertedData, errors } = this.csvService.convertValidate(result);
          this.errors = errors;
          if (errors.length > 0) {
            this.msgs = [];
            this.msgs.push({ severity: 'error', summary: 'Error', detail: 'The file contains errors' });
            resolve(null)
          } else {
            resolve(convertedData)
          }
        } catch (error) {
          resolve(null)
        }
      }
    })
  }

  async upload(fileObject) {
    //!TODO upload to server
    console.log('fileObject', fileObject)
    return;
  }

}
