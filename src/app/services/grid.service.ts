import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { map, tap, distinctUntilChanged, withLatestFrom, mergeMap, concatMap, switchMap, refCount, publishReplay } from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

import { PointCoordinates, GridSettings, AvailableSpreadingFunction } from 'app/models';
import { SpreadPaintUtils } from 'app/utils';
import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class GridService {
  private readonly spreadPaintFunctionsMap: { [key in AvailableSpreadingFunction]: typeof SpreadPaintUtils.spreadPaintLines } = {
    [AvailableSpreadingFunction.lines]: SpreadPaintUtils.spreadPaintLines,
    [AvailableSpreadingFunction.diamonds]: SpreadPaintUtils.spreadPaintDiamonds,
    [AvailableSpreadingFunction.circles]: SpreadPaintUtils.spreadPaintCircles,
  };

  private readonly state = new BehaviorSubject<Array<Array<number>>>([]);
  private readonly clearImmutablySubject = new Subject();
  private readonly spreadPaintMutablySubject = new Subject<PointCoordinates>();

  private stepPauseTime: number;

  private readonly clearImmutablyEffect = this.clearImmutablySubject.pipe(
    withLatestFrom(this.gridKeysX$, this.gridKeysY$),
    tap(([_, keysX, keysY]) => this.state.next(keysX.map(() => keysY.map(() => 0)))),
  );

  private readonly spreadPaintMutablyEffect = this.clearImmutablySubject.pipe(
    publishReplay(),
    refCount(),
    // to drop all paint observables on clear event
    switchMap(() => {
      return this.spreadPaintMutablySubject.pipe(
        withLatestFrom(this.settingsService.gridSettings$, this.settingsService.paintSettings$),
        mergeMap(([startPoint, gridSettings, { spreadingFn }]) =>
          this.spreadPaint$(startPoint, gridSettings, spreadingFn),
        ),
        tap((checkedPoints) => {
          const gridValues = this.state.value;
          checkedPoints.forEach(({ x, y }) => gridValues[x][y]++);
          this.state.next(gridValues);
        }),
      );
    }),
  );

  private readonly paintSettingsChangeEffect = this.settingsService.paintSettings$.pipe(
    map(({ stepPauseTime }) => stepPauseTime),
    distinctUntilChanged(),
    tap((stepPauseTime) => this.stepPauseTime = stepPauseTime),
  );

  private readonly gridSettingsChangeEffect = this.settingsService.gridSettings$.pipe(
    map((value) => ({ sizeX: value.gridSizeX, sizeY: value.gridSizeY })),
    distinctUntilChanged(isEqual),
    tap(() => this.clearImmutablySubject.next()),
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
    this.paintSettingsChangeEffect.subscribe();
    this.spreadPaintMutablyEffect.subscribe();
    this.gridSettingsChangeEffect.subscribe();
  }

  clearImmutably() {
    this.clearImmutablySubject.next();
  }

  spreadPaintMutably(startPoint: PointCoordinates) {
    this.spreadPaintMutablySubject.next(startPoint);
  }

  private spreadPaint$(
    startPoint: PointCoordinates,
    gridSettings: GridSettings,
    spreadingFn: AvailableSpreadingFunction,
  ) {
    return this.spreadPaintFunctionsMap[spreadingFn](startPoint, gridSettings).pipe(
      concatMap((value, i) => {
        return !i
          ? of(value)
          : new Observable<PointCoordinates[]>((observer) => {
            setTimeout(() => {
              observer.next(value);
              observer.complete();
            }, this.stepPauseTime);
          });
      }),
    );
  }
}
