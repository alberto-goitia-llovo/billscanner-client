import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SheetReaderComponent } from './sheet-reader/sheet-reader.component';

const routes: Routes = [
  {path: 'sheet-reader', component: SheetReaderComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
