import { Observable } from 'rxjs';
import { PointCoordinates, GridSettings } from 'app/models';

export function spreadPaintCircles(
  { x, y }: PointCoordinates,
  { gridSizeX, gridSizeY }: GridSettings,
): Observable<PointCoordinates[]> {
  return new Observable<PointCoordinates[]>((observer) => {
    const visitedPointsMap = {};
    for (let i = 1; i < Math.max(gridSizeX, gridSizeY); i++) {
      const checkedPoints = [];

      for (let relativeX = -i; relativeX <= i; ++relativeX) {
        const maxRelativeY = Math.floor(Math.sqrt(i ** 2 - relativeX ** 2));
        for (let relativeY = -maxRelativeY; relativeY <= maxRelativeY; relativeY++) {
          if (!visitedPointsMap[`${relativeX},${relativeY}`]) {
            const pointX = relativeX + x;
            const pointY = relativeY + y;

            if (pointX < 0 || pointX >= gridSizeX || pointY < 0 || pointY >= gridSizeY) {
              continue;
            }

            checkedPoints.push({ x: pointX, y: pointY });
            visitedPointsMap[`${relativeX},${relativeY}`] = true;
          }
        }
      }

      observer.next(checkedPoints);
    }
    observer.complete();
  });
}

export function spreadPaintDiamonds(
  { x, y }: PointCoordinates,
  { gridSizeX, gridSizeY }: GridSettings,
): Observable<PointCoordinates[]> {
  return new Observable<PointCoordinates[]>((observer) => {
    observer.next([{ x, y }]);
    for (let i = 1; i < Math.max(gridSizeX, gridSizeY) * 2; i++) {
      const checkedPoints = [];

      for (let j = 0; j <= i; j++) {
        const topY = y - i + j;
        const botY = y + i - j;
        const rightX = x + j;
        const leftX = x - j;

        if (topY >= 0) {
          if (rightX < gridSizeX) { checkedPoints.push({ x: rightX, y: topY }) };
          if (leftX >= 0 && leftX !== rightX) { checkedPoints.push({ x: leftX, y: topY }) };
        }

        if (botY < gridSizeY && botY !== topY) {
          if (rightX < gridSizeX) { checkedPoints.push({ x: rightX, y: botY }) };
          if (leftX >= 0 && leftX !== rightX) { checkedPoints.push({ x: leftX, y: botY }) };
        }
      }

      observer.next(checkedPoints);
    }
    observer.complete();
  });
}

export function spreadPaintLines(
  { x, y }: PointCoordinates,
  { gridSizeX, gridSizeY }: GridSettings,
): Observable<PointCoordinates[]> {
  return new Observable<PointCoordinates[]>((observer) => {
    observer.next([{ x, y }]);
    for (let i = 1; i < Math.max(gridSizeX, gridSizeY); i++) {
      const topY = y - i;
      const botY = y + i;
      const leftX = x - i;
      const rightX = x + i;

      const checkedPoints = [];

      if (leftX >= 0) { checkedPoints.push({ x: leftX, y }); }
      if (rightX < gridSizeX) { checkedPoints.push({ x: rightX, y }); }

      if (topY >= 0) { checkedPoints.push({ x, y: topY }); }
      if (botY < gridSizeY) { checkedPoints.push({ x, y: botY }); }

      if (checkedPoints.length) { observer.next(checkedPoints); }
    }
    observer.complete();
  });
}
