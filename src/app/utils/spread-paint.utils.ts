import { Observer } from 'rxjs';
import { PointCoordinates, Settings } from 'app/models';

export async function spreadPaintDiamondsMutably(
  { x, y }: PointCoordinates,
  gridValues: Array<Array<number>>,
  { gridSizeX, gridSizeY, stepPauseTime: spreadingSpeed }: Settings,
  observer: Observer<Array<Array<number>>>,
) {
  gridValues[x][y]++;
  for (let i = 1; i < Math.max(gridSizeX, gridSizeY); i++) {
    for (let j = 0; j <= i; j++) {
      const topY = y - i + j;
      const botY = y + i - j;
      const rightX = x + j;
      const leftX = x - j;

      if (topY >= 0) {
        if (rightX < gridSizeX) { gridValues[rightX][topY]++; }
        if (leftX >= 0 && leftX !== rightX) { gridValues[leftX][topY]++; }
      }

      if (botY < gridSizeY && botY !== topY) {
        if (rightX < gridSizeX) { gridValues[rightX][botY]++; }
        if (leftX >= 0 && leftX !== rightX) { gridValues[leftX][botY]++; }
      }
    }
    await skipTime(spreadingSpeed);
    observer.next(gridValues);
  }
  observer.complete();
}

export async function spreadPaintLinesMutably(
  { x, y }: PointCoordinates,
  gridValues: Array<Array<number>>,
  { gridSizeX, gridSizeY, stepPauseTime: spreadingSpeed }: Settings,
  observer: Observer<Array<Array<number>>>,
) {
  gridValues[x][y]++;
  for (let i = 1; i < Math.max(gridSizeX, gridSizeY); i++) {
    const topY = y - i;
    const botY = y + i;
    const leftX = x - i;
    const rightX = x + i;

    if (leftX >= 0) { gridValues[leftX][y]++; }
    if (rightX < gridSizeX) { gridValues[rightX][y]++; }

    if (topY >= 0) { gridValues[x][topY]++; }
    if (botY < gridSizeY) { gridValues[x][botY]++; }

    await skipTime(spreadingSpeed);
    observer.next(gridValues);
  }
  observer.complete();
}

function skipTime(speed: number) {
  return new Promise(resolve => setTimeout(resolve, speed));
}
