// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckinsComponent } from './checkins/checkins.component';

const routes: Routes = [
  { path: '', redirectTo: 'checkins', pathMatch: 'full' },
  { path: 'checkins', component: CheckinsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }