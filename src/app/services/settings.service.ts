import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, distinctUntilChanged } from 'rxjs/operators';

import { Settings, defaultSettings, AvailableGridEngine } from 'app/models';
import { appRoutesNames } from 'app/app.routes.names';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private readonly state = new BehaviorSubject<Settings>(defaultSettings);

  private readonly engineRouteMap: { [key in AvailableGridEngine]: string } = {
    [AvailableGridEngine.angular]: appRoutesNames.angularEngineGrid,
    [AvailableGridEngine.custom]: appRoutesNames.customEngineGrid,
  };

  private readonly engineChangeEffect = this.value$.pipe(
    map((value) => value.engine),
    distinctUntilChanged(),
    tap((engine) => this.router.navigate([this.engineRouteMap[engine]])),
  );

  get value$(): Observable<Settings> {
    return this.state.asObservable();
  }

  constructor(private readonly router: Router) {
    this.engineChangeEffect.subscribe();
  }

  update(value: Partial<Settings>) {
    this.state.next({
      ...this.state.value,
      ...value,
    });
  }
}
