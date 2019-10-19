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
  readonly gridSizeX = 200;
  readonly gridSizeY = 110;

  pointsCheckFlags: Array<Array<boolean>> = [
    ...Array(this.gridSizeX).keys(),
  ].map(() => [...Array(this.gridSizeY).keys()].map(() => false));

  trackByFn(index, item) {
    return index;
  }

  onPointClicked({ x, y }: PointCoordinates) {
    for (let i = 0; i < this.gridSizeX; i++) {
      this.pointsCheckFlags[i][y] = true;
    }

    for (let i = 0; i < this.gridSizeY; i++) {
      this.pointsCheckFlags[x][i] = true;
    }
  }
}
