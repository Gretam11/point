import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { components } from './components';
import { containers } from './containers';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ...components,
    ...containers,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
