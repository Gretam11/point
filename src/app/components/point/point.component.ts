import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointComponent {
  @Input() coordinates: { x: number, y: number };
  @Input() checked: boolean;
}
