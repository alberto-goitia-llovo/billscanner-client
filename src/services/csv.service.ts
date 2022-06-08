import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { IBillDTO } from '../interfaces/bills.interface';
import { ISync } from '../interfaces/sync.interface';
import { CredentialsService } from './credentials.service';
import * as _ from 'lodash';

export type decimalSeparatorType = "." | ",";
export type delimiterType = "," | ";";

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  constructor(
    private credentialsService: CredentialsService
  ) { }

  BILL_TYPES_HASH = { 'income': true, 'expense': true, 'repayment': true, 'transfer': true, '': true };


  // TYPE_VALIDATION_SCHEMA = {
  //   "number": {
  //     typeConverter: (value) => Number(value),
  //     validator: (convertedValue) => !isNaN(convertedValue)
  //   },
  //   "string": {
  //     typeConverter: (value) => String(value).trim(),
  //   },
  //   "date": {
  //     typeConverter: (value, format) => DateTime.fromFormat(value, format),
  //     validator: (convertedValue) => convertedValue.isValid
  //   },
  //   "bill_type": {
  //     typeConverter: (value) => String(value).trim(),
  //     validator: (convertedValue) => this.CATEGORY_TYPES_HASH[convertedValue]
  //   }
  // }

  VALUE_TYPES = {
    "Date": {
      type: 'date',
      schema: {
        typeConverter: (value, format) => DateTime.fromFormat(value, format),
        validator: (convertedValue) => convertedValue.isValid
      }
    },
    "Concept": {
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim(),
        //No validator because any data can be entered in th concept field
      }
    },
    "Amount": {
      type: 'number',
      schema: {
        typeConverter: (value) => Number(value),
        validator: (convertedValue) => !isNaN(convertedValue)
      }
    },
    "Category": {
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim().toUpperCase(),
        //No validator for allowing the user not to specify category. In which case, it will be set to default categories
      }
    },
    "Account Name": {
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim().toUpperCase(),
        //No validator for allowing the user not to specify account. If the user has no accounts a default one will be created. 
      }
    },
    "Details": {
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim(),
        //No validator because any data can be entered in the details field
      }
    },
    "Bill Type": {
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim().toLocaleLowerCase(),
        //No validator for allowing the user not to specify bill type. In which case, it will be set to default bill (positive amount income, negative amount expense)
      }
    }
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

  convertValidate(data, formats = { date: 'yyyy-MM-dd' }, syncData: ISync): { errors: any[], convertedData: IBillDTO[], new_accounts: string[] } {
    let errors: { row: number, info: string, value: any }[] = [];
    let new_accounts: string[] = [];
    let new_categories: string[] = [];
    let convertedData = _.cloneDeep(data);

    // Validate header names
    let headers = Object.keys(data[0]);
    let schema_headers = Object.keys(this.VALUE_TYPES);
    for (let i = 0; i < schema_headers.length; i++) {
      if (headers[i] != schema_headers[i]) {
        errors.push({
          row: 1,
          value: headers[i],
          info: `Headers do not match the template`
        });
        return { convertedData, errors, new_accounts };
      }
    }

    let account_hash = {};
    for (let account of syncData.accounts) account_hash[String(account.name).trim().toUpperCase()] = account;
    let category_hash = {};
    for (let category of syncData.categories) {
      let name = String(category.name).trim().toUpperCase();
      if (!category_hash[name]) category_hash[name] = {};
      if (!category_hash[name][category.type]) category_hash[name][category.type] = {};
      category_hash[name][category.type] = category;
    }

    loop1:
    for (let row = 1; row < data.length; row++) {
      // Validate data types and convert
      for (let column = 0; column < schema_headers.length; column++) {
        let value = data[row][schema_headers[column]];
        let type = this.VALUE_TYPES[schema_headers[column]].type;
        let schema = this.VALUE_TYPES[schema_headers[column]].schema;
        let convertedValue = schema.typeConverter(value, formats[type]);
        convertedData[row][schema_headers[column]] = convertedValue;
        data[row][schema_headers[column]] = convertedValue;

        if (schema.validator ? !schema.validator(convertedValue) : false) {
          errors.push({
            row: row + 2,
            value: value,
            info: `Invalid ${schema_headers[column]}`
          });
          //Go to the next row
          continue loop1;
        }
      }

      //More complex validations
      //Validate accounts and add new ones
      let account_name = data[row]['Account Name'];
      if (!account_hash[account_name]) {
        if (account_name == '') {
          if (Object.keys(account_hash).length == 0) {
            //If the user has no accounts yet a default one will be created
            let user_name = this.credentialsService.currentUserValue.name;
            new_accounts.push(`${user_name}'s account`);
          } else {
            //If the user did not specify the account an error will be thrown
            errors.push({
              row: row + 2,
              value: '-',
              info: `Account not specified`
            });
          }
          continue;
        }
        new_accounts.push(account_name);
        account_hash[account_name] = true;
      }

      //Validate categories (and set defaults)
      let category_name = data[row]['Category'];
      console.log('category_name', category_name)
      if (!category_hash[category_name]) {
        if (category_name == '') {
          //Category not specified, default value is assigned
          data[row]['Category'] = 'OTHER';
        } else {
          console.log('category_name', category_name)
          errors.push({
            row: row + 2,
            value: '-',
            info: `Category does not exist`
          })
          continue;
        }
      }
      //Validate bill types
      let bill_type = data[row]['Bill Type'];
      if (!this.BILL_TYPES_HASH[bill_type]) {
        if (this.BILL_TYPES_HASH[bill_type] == '') {
          //Bill type not specified, default value is assigned
          let amount = data[row]['Amount'];
          data[row]['Bill Type'] = amount > 0 ? 'income' : 'expense';
        } else {
          errors.push({
            row: row + 2,
            value: bill_type,
            info: `Invalid bill type`
          })
        }
      }
      bill_type = data[row]['Bill Type'];
      category_name = data[row]['Category'];
      if (this.BILL_TYPES_HASH[bill_type]) {
        let category = category_hash[category_name];
        if (this.BILL_TYPES_HASH[bill_type] != category.type) {
          errors.push({
            row: row + 2,
            value: bill_type,
            info: `Bill type does not match category type`
          })
        }
      }

    }
    return { convertedData, errors, new_accounts };
  }


}
