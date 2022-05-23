import { ChildrenOutletContexts } from '@angular/router';
import { PrimeNGConfig } from 'primeng/api';
import { Component, HostBinding } from '@angular/core';
import { slideInAnimation } from './animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {

  menuMode = 'static';

  constructor(private primengConfig: PrimeNGConfig, private contexts: ChildrenOutletContexts) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
    document.documentElement.style.fontSize = '14px';
  }


  getRouteAnimationData() {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}
