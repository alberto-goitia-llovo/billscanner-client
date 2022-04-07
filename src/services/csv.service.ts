import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import * as _ from 'lodash';

export type decimalSeparatorType = "." | ",";
export type delimiterType = "," | ";";

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor() { }

  TYPE_VALIDATION_SCHEMA = {
    "number": {
      typeConverter: (value) => Number(value),
      validator: (convertedValue) => !isNaN(convertedValue)
    },
    "string": {
      typeConverter: (value) => String(value),
    },
    "date": {
      typeConverter: (value, format) => DateTime.fromFormat(value, format),
      validator: (convertedValue) => convertedValue.isValid
    },
  }

  VALUE_TYPES = {
    "Date": "date",
    "Concept": "string",
    "Amount": "number",
    "Account Balance": "number",
    "Categories": "string",
    "Account Name": "string",
    "Details": "string",
  }

  parse(csv, delimiter: delimiterType = ",") {
    let lines = csv.split("\n");
    let result: any[] = [];
    let headers = lines[0].split(delimiter).map(value => value.trim());
    for (let i = 1; i < lines.length; i++) {
      let obj = {};
      if (!lines[i].trim()) continue;
      let currentline = lines[i].split(delimiter);
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j]?.trim() || '';
      }
      result.push(obj);
    }
    return result;
  }

  convertValidate(data, formats = { date: 'yyyy-MM-dd' }): { errors: any[], convertedData: any[] } {
    let errors: { row: number, info: string }[] = [];
    let convertedData = _.cloneDeep(data);

    // Validate header names
    let headers = Object.keys(data[0]);
    let schema_headers = Object.keys(this.VALUE_TYPES);
    for (let i = 0; i < schema_headers.length; i++) {
      if (headers[i] != schema_headers[i]) {
        errors.push({
          row: 1,
          info: `Headers do not match the template`
        });
        return { convertedData, errors };
      }
    }

    // Validate data types and formats
    for (let row = 1; row < data.length; row++) {
      for (let column = 0; column < schema_headers.length; column++) {
        let value = data[row][schema_headers[column]];
        let type = this.VALUE_TYPES[schema_headers[column]];
        let schema = this.TYPE_VALIDATION_SCHEMA[type];
        let convertedValue = schema.typeConverter(value, formats[type]);
        convertedData[row][schema_headers[column]] = convertedValue;

        if (schema.validator ? !schema.validator(schema.typeConverter(value, formats[type])) : false) {
          errors.push({
            row: row + 2,
            info: `Invalid ${schema_headers[column]}`
          });
          break;
        }
      }
    }
    return { convertedData, errors };
  }
}
