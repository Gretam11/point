import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { PointCoordinates, PaintSettings } from 'app/models';
import { GridService, SettingsService } from 'app/services';

@Component({
  selector: 'app-grid-angular-engine',
  templateUrl: './grid-angular-engine.component.html',
  styleUrls: ['./grid-angular-engine.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridAngularEngineComponent implements OnInit {
  gridValues$: Observable<Array<Array<number>>>;
  gridKeysX$: Observable<number[]>;
  gridKeysY$: Observable<number[]>;
  paintSettings$: Observable<PaintSettings>;

  constructor(
    private readonly settingsService: SettingsService,
    private readonly gridService: GridService) { }

  ngOnInit() {
    this.gridValues$ = this.gridService.gridValues$;
    this.gridKeysX$ = this.gridService.gridKeysX$;
    this.gridKeysY$ = this.gridService.gridKeysY$;
    this.paintSettings$ = this.settingsService.paintSettings$;
  }

  trackByFn(index, item) {
    return index;
  }

  onPointClick(coordinates: PointCoordinates) {
    this.gridService.spreadPaintMutably(coordinates);
  }
}
