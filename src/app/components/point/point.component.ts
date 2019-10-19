import { Component, Input, ChangeDetectionStrategy, Output, EventEmitter } from '@angular/core';
import { PointCoordinates } from 'src/app/models';

@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointComponent {
  @Input() coordinates: PointCoordinates;
  @Input() checked: boolean;
  @Output() clicked = new EventEmitter<PointCoordinates>();

  onClick() {
    this.clicked.emit(this.coordinates);
  }
}
