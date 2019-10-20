import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { PointCoordinates } from 'app/models';
import { GridService } from 'app/services';

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

  constructor(private readonly gridService: GridService) { }

  ngOnInit() {
    this.gridValues$ = this.gridService.gridValues$;
    this.gridKeysX$ = this.gridService.gridKeysX$;
    this.gridKeysY$ = this.gridService.gridKeysY$;
  }

  trackByFn(index, item) {
    return index;
  }

  onPointClick(coordinates: PointCoordinates) {
    this.gridService.spreadPaintMutably(coordinates);
  }
}
