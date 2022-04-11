import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { IAppConfig } from '../interfaces/appconfig.interface';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {

    config: IAppConfig = {
        theme: 'vela-blue',
        dark: true,
        inputStyle: 'outlined',
        ripple: true
    };

    private configUpdate = new Subject<IAppConfig>();

    configUpdate$ = this.configUpdate.asObservable();

    updateConfig(config: IAppConfig) {
        this.config = config;
        console.log("UPDATE CONFIG DESDE CONFIG SERVICE", this.config);
        this.configUpdate.next(config);
    }

    getConfig() {
        return this.config;
    }
}
