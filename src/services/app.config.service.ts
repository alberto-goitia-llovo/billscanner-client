import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../interfaces/appconfig';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    config: AppConfig = {
        theme: 'vela-blue',
        dark: true,
        inputStyle: 'outlined',
        ripple: true
    };

    private configUpdate = new Subject<AppConfig>();

    configUpdate$ = this.configUpdate.asObservable();

    updateConfig(config: AppConfig) {
        this.config = config;
        console.log("UPDATE CONFIG DESDE CONFIG SERVICE", this.config);
        this.configUpdate.next(config);
    }

    getConfig() {
        return this.config;
    }
}
