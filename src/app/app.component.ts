import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PointCoordinates } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  readonly Array = Array;
  readonly gridSizeX = 125;
  readonly gridSizeY = 60;
  readonly gridRangeX = [...Array(this.gridSizeX).keys()];
  readonly gridRangeY = [...Array(this.gridSizeY).keys()];
  readonly speed = 100;

  pointsValues: Array<Array<number>> = this.gridRangeX.map(() => this.gridRangeY.map(() => 0));

  trackByFn(index, item) {
    return index;
  }

  async spreadPaintLines({ x, y }: PointCoordinates) {
    this.pointsValues[x][y]++;
    for (let i = 1; i < Math.max(this.gridSizeX, this.gridSizeY); i++) {
      const topY = y - i;
      const botY = y + i;
      const leftX = x - i;
      const rightX = x + i;

      if (leftX >= 0) { this.pointsValues[leftX][y]++; }
      if (rightX < this.gridSizeX) { this.pointsValues[rightX][y]++; }

      if (topY >= 0) { this.pointsValues[x][topY]++; }
      if (botY < this.gridSizeY) { this.pointsValues[x][botY]++; }

      await this.skipTime();
    }
  }

  async spreadPaintSquare({ x, y }: PointCoordinates) {
    this.pointsValues[x][y]++;
    for (let i = 1; i < Math.max(this.gridSizeX, this.gridSizeY) ** 2; i++) {
      for (let j = 0; j <= i; j++) {
        const topY = y - i + j;
        const botY = y + i - j;
        const rightX = x + j;
        const leftX = x - j;

        if (topY >= 0) {
          if (rightX < this.gridSizeX) { this.pointsValues[rightX][topY]++; }
          if (leftX >= 0 && leftX !== rightX) { this.pointsValues[leftX][topY]++; }
        }

        if (botY < this.gridSizeY && botY !== topY) {
          if (rightX < this.gridSizeX) { this.pointsValues[rightX][botY]++; }
          if (leftX >= 0 && leftX !== rightX) { this.pointsValues[leftX][botY]++; }
        }
      }
      await this.skipTime();
    }
  }

  private skipTime() {
    return new Promise(resolve => setTimeout(resolve, this.speed));
  }
}
