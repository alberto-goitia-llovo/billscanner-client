import { Injectable } from '@angular/core';

export type decimalSeparatorType = "." | ",";
export type delimiterType = "," | ";";

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  VALIDATION_SCHEMA = {
    "Date": { type: "date" },
    "Concept": { type: "string" },
    "Amount": { type: "number" },
    "Account Balance": { type: "number" },
    "Categories": { type: "string" },
    "Account": { type: "string" },
    "Name": { type: "string" },
    "Details": { type: "string" },
  }

  parse(csv, delimiter: delimiterType = ",") {
    let lines = csv.split("\n");
    let result: any[] = [];
    let headers = lines[0].split(delimiter).map(value => value.trim());
    console.log('headers', headers)
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      let currentline = lines[i].split(delimiter);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]?.trim() || '';
      }
      result.push(obj);
    }
    return result;
  }

  validate(data): { row: number, message: string }[] | null {
    /**
     * Validate all the headers and data
     * 
     * 1. Validate header names
     * 2. Validate data types
     * 3. Validate date formats
     */
    let errors: { row: number, message: string }[] = [];
    let headers = Object.keys(data[0]);
    let schema_headers = Object.keys(this.VALIDATION_SCHEMA);
    for (let i = 0; i < schema_headers.length; i++) {
      if (headers[0] != schema_headers[i]) {
        errors.push({
          row: 0,
          message: `Headers do not match the template`
        });
        return errors;
      }
    }
    return errors.length ? errors : null;
  }
}
