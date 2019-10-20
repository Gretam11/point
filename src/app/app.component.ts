import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { SettingsService } from './services';
import { Settings } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  settings$: Observable<Settings>;

  constructor(private readonly settingsService: SettingsService) { }

  ngOnInit() {
    this.settings$ = this.settingsService.value$;
  }

  onSettingsApplied(settings: Settings) {
    this.settingsService.update(settings);
  }
}
