import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public appMain: AppMainComponent) { }

    ngOnInit() {
        this.model = [
            {
                label: "Menu",
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-chart-pie', routerLink: ['/pages/dashboard'] },
                    { label: 'My Bills', icon: 'pi pi-fw pi-money-bill', routerLink: ['/pages/my-bills'] },
                    { label: 'Upload Bills', icon: 'pi pi-fw pi-upload', routerLink: ['/pages/upload-bills'] },
                    { label: 'Categories', icon: 'pi pi-fw pi-hashtag', routerLink: ['/pages/categories'] },
                    { label: 'Objectives', icon: 'pi pi-fw pi-chart-line', routerLink: ['/pages/objectives'] },
                    { label: 'Accounts', icon: 'pi pi-fw pi-credit-card', routerLink: ['/pages/accounts'] },
                ]
            },
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement>event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
