import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { components } from './components';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    ...components,
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
