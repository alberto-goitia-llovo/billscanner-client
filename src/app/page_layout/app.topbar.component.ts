import { Component, OnDestroy } from '@angular/core';
import { AppMainComponent } from './app.main.component';
import { Subscription, BehaviorSubject } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { ConfigService } from '../../services/app.config.service';
import { AppConfig } from '../../interfaces/appconfig';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    styles: [`
    :host ::ng-deep p-inputswitch {
        display: flex;
        justify-content: center;
        align-items: center;
    }
  `]
})
export class AppTopBarComponent {

    items: MenuItem[];
    dark_mode: boolean;
    config: AppConfig;

    subscription: Subscription;


    private darkModeUpdate$: BehaviorSubject<any>;

    constructor(
        public appMain: AppMainComponent,
        public configService: ConfigService
    ) {
        this.config = this.configService.config;
        this.dark_mode = this.config.dark || false;
        this.darkModeUpdate$ = new BehaviorSubject<boolean>(this.dark_mode);
    }

    ngOnInit() {
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
        });

        this.darkModeUpdate$.subscribe((dark) => {
            this.changeTheme(dark ? 'vela-blue' : 'saga-blue', dark)
        })
    }

    toggleDarkMode() {
        this.darkModeUpdate$.next(this.dark_mode);
    }

    changeTheme(theme: string, dark: boolean) {
        let themeElement = document.getElementById('theme-css');
        if (!themeElement) return;
        themeElement.setAttribute('href', 'assets/theme/' + theme + '/theme.css');
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
    }

}
