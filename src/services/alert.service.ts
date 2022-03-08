import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

export type AlertType = "error" | "warning" | "success" | "info";
export type InterceptedAlerts = {
  [errorMessage: string]: { message: string, type: AlertType }
};

const closeIcon = '<mat-icon aria-hidden="false" aria-label="Example home icon">home</mat-icon>'

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  //TODO: when the user clicks the close button the next message should appear inmediately
  constructor(
    private _snackBar: MatSnackBar,
  ) {
  }

  SECONDS = 5;

  DURATION_MS = this.SECONDS * 1000;
  TURN_ARRAY: number[] = [];
  TURNS = 0;
  MAX_TRIES = 30;

  /**
   * Adds an alert to the queue and displays it when possible.
   * 
   * The alerts on the queue will be displayed sequentially (FIFO order).
   * The alerts will remain {@link SECONDS} seconds on screen
   * @param message 
   * @param type 
   * @param action 
   * @returns 
   */
  async queueAlert(message: string, type: AlertType, action = "Close") {
    this.TURNS++;
    let turn_id = this.TURNS
    this.TURN_ARRAY.push(turn_id);
    let is_my_turn = this.TURN_ARRAY[0] == turn_id;
    let tries = 1;
    while (!is_my_turn) {
      await this.sleep(this.DURATION_MS)
      is_my_turn = this.TURN_ARRAY[
        0] == turn_id;
      tries++;
      if (tries > this.MAX_TRIES) { //To avoid infinite loop
        this.TURNS--;
        return
      };
    }
    this.popAlert(message, type, action)
    await this.sleep(this.DURATION_MS)
    this.TURN_ARRAY.shift()
    this.TURNS--;
    if (!this.TURN_ARRAY.length) this.TURNS = 0; //Just for safety
  }

  async sleep(miliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, miliseconds))
  }

  /**
   * Displays an alert on screen inmediately. 
   * 
   * If several alerts are triggered simultaneously only the last one is displayed
   * @param message 
   * @param type 
   * @param action 
   */
  private popAlert(message: string, type: AlertType, action: string) {
    let config = new MatSnackBarConfig();
    config.duration = this.DURATION_MS;
    config.panelClass = [`${type}-snackbar`]
    this._snackBar.open(message, action, config)
  }
}

