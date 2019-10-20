import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';

import { AvailableGridEngine, GridSettings, PaintSettings, defaultGridSettings, defaultPaintSettings } from 'app/models';
import { appRoutesNames } from 'app/app.routes.names';

interface SettingsState {
  grid: GridSettings;
  paint: PaintSettings;
}

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly state = new BehaviorSubject<SettingsState>({
    grid: defaultGridSettings,
    paint: defaultPaintSettings,
  });

  private readonly engineRouteMap: { [key in AvailableGridEngine]: string } = {
    [AvailableGridEngine.angular]: appRoutesNames.angularEngineGrid,
    [AvailableGridEngine.custom]: appRoutesNames.customEngineGrid,
  };

  private readonly gridEngineChangeEffect = this.gridSettings$.pipe(
    map((value) => value.engine),
    distinctUntilChanged(),
    tap((engine) => this.router.navigate([this.engineRouteMap[engine]])),
  );

  get gridSettings$(): Observable<GridSettings> {
    return this.state.pipe(
      distinctUntilChanged(),
      map((state) => state.grid),
    );
  }

  get paintSettings$(): Observable<PaintSettings> {
    return this.state.pipe(
      distinctUntilChanged(),
      map((state) => state.paint),
    );
  }

  constructor(private readonly router: Router) {
    this.gridEngineChangeEffect.subscribe();
  }

  updateGridSettings(value: Partial<GridSettings>) {
    this.state.next({
      ...this.state.value,
      grid: {
        ...this.state.value.grid,
        ...value,
      },
    });
  }

  updatePaintSettings(value: Partial<PaintSettings>) {
    this.state.next({
      ...this.state.value,
      paint: {
        ...this.state.value.paint,
        ...value,
      },
    });
  }
}
