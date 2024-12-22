
// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { CheckinsComponent } from './checkins/checkins.component';
import { LocationsService } from './checkins/location.services';
import { AppRoutingModule } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    CheckinsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [LocationsService],
  bootstrap: [AppComponent]
})
export class AppModule { }