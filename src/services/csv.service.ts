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

  BILL_TYPES_HASH = { 'income': true, 'expense': true, 'repayment': true, 'transfer': true };


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
      field: 'date',
      type: 'date',
      schema: {
        typeConverter: (value, format) => {
          let convertedValue = DateTime.fromFormat(value, format);
          return convertedValue.isValid ? convertedValue.toISODate() : null;
        },
        validator: (convertedValue) => !!convertedValue
      }
    },
    "Concept": {
      field: 'concept',
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim(),
        //No validator because any data can be entered in th concept field
      }
    },
    "Amount": {
      field: 'amount',
      type: 'number',
      schema: {
        typeConverter: (value) => Number(value),
        validator: (convertedValue) => !isNaN(convertedValue)
      }
    },
    "Category": {
      field: 'category',
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim().toUpperCase(),
        //No validator for allowing the user not to specify category. In which case, it will be set to default categories
      }
    },
    "Account": {
      field: 'account',
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim().toUpperCase(),
        //No validator for allowing the user not to specify account. If the user has no accounts a default one will be created. 
      }
    },
    "Details": {
      field: 'details',
      type: 'string',
      schema: {
        typeConverter: (value) => String(value).trim(),
        //No validator because any data can be entered in the details field
      }
    },
    "Bill Type": {
      field: 'bill_type',
      type: 'string',
      schema: {
        typeConverter: (value) => value ? String(value).trim().toLocaleLowerCase() : null,
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

  convertValidate(data, formats = { date: 'yyyy-MM-dd' }, syncData: ISync): { errors: any[], convertedData: IBillDTO[] | null, new_accounts: string[] } {
    let errors: { row: number, info: string, value: any }[] = [];
    let new_accounts: string[] = [];
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
        return { convertedData: null, errors, new_accounts };
      }
    }

    let account_hash = {};
    for (let account of syncData.accounts) account_hash[String(account.name).trim().toUpperCase()] = true;
    let category_hash = {};
    for (let category of syncData.categories) {
      let name = String(category.name).trim().toUpperCase();
      if (!category_hash[name]) category_hash[name] = {};
      if (!category_hash[name][category.type]) category_hash[name][category.type] = {};
      category_hash[name][category.type] = category;
    }

    loop1:
    for (let row = 0; row < data.length; row++) {
      // Validate data types and convert
      for (let column = 0; column < schema_headers.length; column++) {
        let header = schema_headers[column];
        let value = data[row][header];
        let type = this.VALUE_TYPES[header].type;
        let schema = this.VALUE_TYPES[header].schema;
        let field = this.VALUE_TYPES[header].field;
        console.log('field', field)
        let convertedValue = schema.typeConverter(value, formats[type]);
        delete convertedData[row][header];
        convertedData[row][field] = convertedValue;

        if (schema.validator ? !schema.validator(convertedValue) : false) {
          errors.push({
            row: row + 2,
            value: value,
            info: `Invalid ${header}`
          });
          //Go to the next row
          continue loop1;
        }
      }

      console.log('convertedData[row]', convertedData[row])
      //More complex validations
      //Validate accounts and add new ones
      let account_name = convertedData[row].account;
      if (!account_hash[account_name]) {
        if (account_name == '') {
          if (!syncData.accounts.length) {
            //If the user has no accounts yet a default one will be created
            let user = this.credentialsService.currentUserValue;
            let new_account = `${user.name}'s account`.toUpperCase();
            convertedData[row].account = new_account;
            if (!account_hash[new_account]) {
              account_hash[new_account] = true;
              new_accounts.push(new_account);
            }
          } else {
            //If the user did not specify the account an error will be thrown
            errors.push({
              row: row + 2,
              value: '-',
              info: `Account not specified`
            });
            continue;
          }
        } else {
          new_accounts.push(account_name);
          account_hash[account_name] = true;
        }
      }

      //Validate categories (and set defaults)
      let category_name = convertedData[row].category;
      if (!category_hash[category_name]) {
        if (category_name == '') {
          //Category not specified, default value is assigned
          convertedData[row].category = 'OTHER';
        } else {
          errors.push({
            row: row + 2,
            value: '-',
            info: `Category does not exist`
          })
          continue;
        }
      }
      //Validate bill types
      let bill_type = convertedData[row].bill_type;
      if (!this.BILL_TYPES_HASH[bill_type]) {
        if (!bill_type) {
          //Bill type not specified, default value is assigned
          let amount = convertedData[row].amount;
          convertedData[row].bill_type = amount > 0 ? 'income' : 'expense';
        } else {
          errors.push({
            row: row + 2,
            value: bill_type,
            info: `Invalid bill type`
          })
        }
      }
      bill_type = convertedData[row].bill_type;
      category_name = convertedData[row].category;
      if (this.BILL_TYPES_HASH[bill_type]) {
        let category = category_hash[category_name][bill_type];
        if (!category) {
          errors.push({
            row: row + 2,
            value: bill_type,
            info: `Bill type does not match category type`
          })
        }
      }

      //All validated, can be added to the final object
    }
    return { convertedData, errors, new_accounts };
  }


}
