import { Component, OnInit, ChangeDetectionStrategy, ElementRef, NgZone } from '@angular/core';
import Stats from 'stats.js';

@Component({
  selector: 'app-performance-meter',
  template: '<span></span>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PerformanceMeterComponent implements OnInit {
  constructor(
    private readonly elRef: ElementRef,
    private readonly ngZone: NgZone,
  ) { }

  ngOnInit() {
    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style = {
      ...stats.dom.style,
      position: 'inherit',
      opacity: 'inherit',
      cursor: 'inherit',
    };
    this.elRef.nativeElement.appendChild(stats.dom);

    this.ngZone.runOutsideAngular(() =>
      requestAnimationFrame(function loop() { stats.update(); requestAnimationFrame(loop); })
    );
  }
}
