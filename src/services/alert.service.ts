import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type AlertType = "error" | "warning" | "success" | "info";

const closeIcon = '<mat-icon aria-hidden="false" aria-label="Example home icon">home</mat-icon>'

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private _snackBar: MatSnackBar,
  ) {
  }

  TIMEOUT = 5 * 1000;
  TURN_ARRAY: number[] = [];
  TURNS = 0;
  MAX_TRIES = 30;

  popAlert(message: string, type: AlertType, action: string) {
    let config = new MatSnackBarConfig();
    config.duration = this.TIMEOUT;
    config.panelClass = [`${type}-snackbar`]
    this._snackBar.open(message, action, config)
  }

  async queueAlert(message: string, type: AlertType, action = "Close") {
    this.TURNS++;
    let turn_id = this.TURNS
    this.TURN_ARRAY.push(turn_id);
    let is_my_turn = this.TURN_ARRAY[0] == turn_id;
    let tries = 1;
    while (!is_my_turn) {
      await this.sleep(this.TIMEOUT)
      is_my_turn = this.TURN_ARRAY[0] == turn_id;
      tries++;
      if (tries > this.MAX_TRIES) { //To avoid infinite loop
        this.TURNS--;
        return
      };
    }
    this.popAlert(message, type, action)
    await this.sleep(this.TIMEOUT)
    this.TURN_ARRAY.shift()
    this.TURNS--;
    if (!this.TURN_ARRAY.length) this.TURNS = 0; //Just for safety
  }

  async sleep(miliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
  }
}

