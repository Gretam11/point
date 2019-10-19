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
  readonly speed = 10;

  pointsCheckFlags: Array<Array<boolean>> = [
    ...Array(this.gridSizeX).keys(),
  ].map(() => [...Array(this.gridSizeY).keys()].map(() => false));

  trackByFn(index, item) {
    return index;
  }

  onPointClicked({ x, y }: PointCoordinates) {
    let i = 0;
    let j = 0;
    const timer = setInterval(() => {
      if (i < this.gridSizeX) { this.pointsCheckFlags[i][y] = true; }
      if (j < this.gridSizeY) { this.pointsCheckFlags[x][j] = true; }
      i++; j++;
      if (i >= this.gridSizeX && j >= this.gridSizeY) { clearInterval(timer); }
    }, this.speed);
  }
}
