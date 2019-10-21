import { DomSanitizer } from '@angular/platform-browser';
import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { Observable } from 'rxjs';

import { SettingsService, GridService } from './services';
import { GridSettings, PaintSettings } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  gridSettings$: Observable<GridSettings>;
  paintSettings$: Observable<PaintSettings>;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly gridService: GridService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
  ) {
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('assets/github.svg'));
  }

  ngOnInit() {
    this.gridSettings$ = this.settingsService.gridSettings$;
    this.paintSettings$ = this.settingsService.paintSettings$;
  }

  onGridSettingsApplied(settings: GridSettings) {
    this.settingsService.updateGridSettings(settings);
  }

  onPaintSettingsChanged(settings: PaintSettings) {
    this.settingsService.updatePaintSettings(settings);
  }

  @HostListener('document:keyup.escape')
  onEscKeyUp() {
    this.gridService.clearMutably();
  }
}
