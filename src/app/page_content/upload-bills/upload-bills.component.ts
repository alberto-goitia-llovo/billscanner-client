import { Component, OnInit } from '@angular/core';
import { CsvService, delimiterType, decimalSeparatorType } from '../../../services/csv.service';
import { BillsService } from 'src/services/bills.service';
import { IBill } from 'src/interfaces/bills.interface';
import { NotificationService } from 'src/services/notification.service';

@Component({
  selector: 'app-upload-bills',
  templateUrl: './upload-bills.component.html',
  styles: [
  ]
})
export class UploadBillsComponent implements OnInit {

  constructor(
    private csvService: CsvService,
    private billsService: BillsService,
    private notificationService: NotificationService
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

  onFileChange(file: File) {
    this.msgs = [];
    this.notificationService.message.clear('messages');
    this.fileready = false;
    let wrongtype = file.type != this.FILE_TYPE;
    let toobig = file.size > this.FILE_SIZE_LIMIT * 1024 * 1024;
    if (wrongtype) this.notificationService.message.error('Error', 'Wrong file type', 'messages')
    if (toobig) this.notificationService.message.error('Error', 'File is too big', 'messages')
    if (wrongtype || toobig) {
      this.discardFile();
      return;
    }
    this.file = file;
    this.readFile(file)
      .then((convertedData: IBill[] | null) => {
        if (!convertedData) return;
        this.billsService.upload(convertedData).subscribe({
          next: () => this.notificationService.message.success('Success', 'Bills uploaded successfully', 'messages'),
          error: () => this.notificationService.message.error('Error', 'Could not upload bills', 'messages')
        })
      })
      .catch(() => this.notificationService.message.error('Error', 'Error uploading bills', 'messages'))
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
    return new Promise<IBill[] | null>((resolve, reject) => {
      const reader: FileReader = new FileReader();
      reader.readAsText(file);
      reader.onload = e => {
        const csv = reader.result;
        let result = this.csvService.parse(csv, this.delimiter);
        //TODO: add custom date formats, csv column delimiter and decimal separator
        let { convertedData, errors } = this.csvService.convertValidate(result);
        this.errors = errors;
        if (errors.length > 0) {
          this.notificationService.message.error('Error', 'The file contains errors', 'messages')
          resolve(null);
        } else {
          resolve(convertedData)
        }
      }
    })
  }

}
