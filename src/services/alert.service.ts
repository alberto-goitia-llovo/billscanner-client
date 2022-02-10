import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) {
  }

  popAlert(message: string, is_error: boolean, action = "Close") {
    this._snackBar.open(message, action)
  }
}
