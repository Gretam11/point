import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, tap, distinctUntilChanged, withLatestFrom } from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

import { SettingsService } from './settings.service';

@Injectable({ providedIn: 'root' })
export class GridService {
  private readonly state = new BehaviorSubject<Array<Array<number>>>([]);
  private readonly clearImmutablySubject = new Subject();

  private readonly settingsChangeEffect = this.settingsService.value$.pipe(
    map((value) => ({ sizeX: value.gridSizeX, sizeY: value.gridSizeY })),
    distinctUntilChanged(isEqual),
    tap(() => this.clearImmutablySubject.next()),
  );

  private readonly clearImmutablyEffect = this.clearImmutablySubject.pipe(
    withLatestFrom(this.gridKeysX$, this.gridKeysY$),
    tap(([_, keysX, keysY]) => this.state.next(keysX.map(() => keysY.map(() => 0)))),
  );

  get value$(): Observable<Array<Array<number>>> {
    return this.state.asObservable();
  }

  get gridKeysX$(): Observable<number[]> {
    return this.settingsService.value$.pipe(
      map(({ gridSizeX }) => gridSizeX),
      distinctUntilChanged(),
      map((sizeX) => [...Array(sizeX).keys()]),
    );
  }

  get gridKeysY$(): Observable<number[]> {
    return this.settingsService.value$.pipe(
      map(({ gridSizeY }) => gridSizeY),
      distinctUntilChanged(),
      map((sizeY) => [...Array(sizeY).keys()]),
    );
  }

  constructor(private readonly settingsService: SettingsService) {
    this.clearImmutablyEffect.subscribe();
    this.settingsChangeEffect.subscribe();
  }

  clearMutably() {
    this.state.value.forEach((line) => line.forEach((_, i) => line[i] = 0));
    this.state.next(this.state.value);
  }

  clearImmutably() {
    this.clearImmutablySubject.next();
  }
}
