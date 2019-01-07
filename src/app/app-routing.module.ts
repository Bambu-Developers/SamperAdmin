import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UiElementsComponent } from './components/ui-elements/ui-elements.component';

const routes: Routes = [
  { path: 'ui-elements', component: UiElementsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
