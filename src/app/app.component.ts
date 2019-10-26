import { Component, OnInit, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

import { SettingsService, GridService } from './services';
import { GridSettings, PaintSettings } from './models';
import { HelpDialogComponent } from './components';

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
    public readonly dialogService: MatDialog,
  ) { }

  ngOnInit() {
    this.gridSettings$ = this.settingsService.gridSettings$;
    this.paintSettings$ = this.settingsService.paintSettings$;
    this.dialogService.open(HelpDialogComponent);
  }

  onGridSettingsApplied(settings: GridSettings) {
    this.settingsService.updateGridSettings(settings);
  }

  onPaintSettingsChanged(settings: PaintSettings) {
    this.settingsService.updatePaintSettings(settings);
  }

  onHelpIconClick() {
    this.dialogService.open(HelpDialogComponent);
  }

  @HostListener('document:keyup.escape')
  onEscKeyUp() {
    this.gridService.clearImmutably();
  }
}
