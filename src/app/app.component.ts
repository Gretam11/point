import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PointCoordinates } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly Array = Array;
  readonly gridSizeX = 125;
  readonly gridSizeY = 60;

  pointsCheckFlags: Array<Array<boolean>> = [
    ...Array(this.gridSizeX).keys(),
  ].map(() => [...Array(this.gridSizeY).keys()].map(() => false));

  trackByFn(index, item) {
    return index;
  }

  onPointClicked({ x, y }: PointCoordinates) {
    this.pointsCheckFlags[x][y] = !this.pointsCheckFlags[x][y];
  }
}
