import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap, distinctUntilChanged, withLatestFrom, mergeMap } from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

import { PointCoordinates, GridSettings, AvailableSpreadingFunction, PaintSettings } from 'app/models';
import { SpreadPaintUtils } from 'app/utils';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class GridService {
  private readonly spreadPaintFunctionsMap: { [key in AvailableSpreadingFunction]: typeof SpreadPaintUtils.spreadPaintDiamondsMutably } = {
    [AvailableSpreadingFunction.lines]: SpreadPaintUtils.spreadPaintLinesMutably,
    [AvailableSpreadingFunction.diamonds]: SpreadPaintUtils.spreadPaintDiamondsMutably,
    [AvailableSpreadingFunction.circles]: SpreadPaintUtils.spreadPaintCirclesMutably,
  };

  private readonly state = new BehaviorSubject<Array<Array<number>>>([]);
  private readonly clearImmutablySubject = new Subject();
  private readonly spreadPaintMutablySubject = new Subject<PointCoordinates>();

  private readonly clearImmutablyEffect = this.clearImmutablySubject.pipe(
    withLatestFrom(this.gridKeysX$, this.gridKeysY$),
    tap(([_, keysX, keysY]) => this.state.next(keysX.map(() => keysY.map(() => 0)))),
  );

  private readonly spreadPaintMutablyEffect = this.spreadPaintMutablySubject.pipe(
    withLatestFrom(this.gridValues$, this.settingsService.gridSettings$, this.settingsService.paintSettings$),
    mergeMap(([startPoint, gridValues, gridSettings, paintSettings]) =>
      this.spreadPaintMutably$(startPoint, gridValues, gridSettings, paintSettings)),
    tap((mutatedState) => this.state.next(mutatedState)),
  );

  private readonly gridSettingsChangeEffect = this.settingsService.gridSettings$.pipe(
    map((value) => ({ sizeX: value.gridSizeX, sizeY: value.gridSizeY })),
    distinctUntilChanged(isEqual),
    tap(() => this.clearImmutablySubject.next()),
  );

  private readonly paintSettingsChangeEffect = this.settingsService.paintSettings$.pipe(
    map((value) => value.stepPauseTime),
    distinctUntilChanged(),
    tap((pauseTime) => SpreadPaintUtils.stepPauseTime.value = pauseTime),
  );

  get gridValues$(): Observable<Array<Array<number>>> {
    return this.state.asObservable();
  }

  get gridKeysX$(): Observable<number[]> {
    return this.settingsService.gridSettings$.pipe(
      map(({ gridSizeX }) => gridSizeX),
      distinctUntilChanged(),
      map((sizeX) => [...Array(sizeX).keys()]),
    );
  }

  get gridKeysY$(): Observable<number[]> {
    return this.settingsService.gridSettings$.pipe(
      map(({ gridSizeY }) => gridSizeY),
      distinctUntilChanged(),
      map((sizeY) => [...Array(sizeY).keys()]),
    );
  }

  constructor(private readonly settingsService: SettingsService) {
    this.clearImmutablyEffect.subscribe();
    this.spreadPaintMutablyEffect.subscribe();
    this.gridSettingsChangeEffect.subscribe();
    this.paintSettingsChangeEffect.subscribe();
  }

  clearMutably() {
    this.state.value.forEach((line) => line.forEach((_, i) => line[i] = 0));
    this.state.next(this.state.value);
  }

  clearImmutably() {
    this.clearImmutablySubject.next();
  }

  spreadPaintMutably(startPoint: PointCoordinates) {
    this.spreadPaintMutablySubject.next(startPoint);
  }

  private spreadPaintMutably$(
    startPoint: PointCoordinates,
    gridValues: Array<Array<number>>,
    gridSettings: GridSettings,
    paintSettings: PaintSettings,
  ): Observable<Array<Array<number>>> {
    return new Observable((observer) => {
      this.spreadPaintFunctionsMap[paintSettings.spreadingFn](startPoint, gridValues, gridSettings, observer);
    });
  }
}
