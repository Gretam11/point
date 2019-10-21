import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { FormBuilder } from 'ngx-strongly-typed-forms';
import { distinctUntilChanged, tap, filter } from 'rxjs/operators';
import isEqual from 'lodash/isEqual';

import { PaintSettings, AvailableSpreadingFunction } from 'app/models';

@Component({
  selector: 'app-paint-settings-form',
  templateUrl: './paint-settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaintSettingsFormComponent implements OnChanges, OnInit {
  readonly spreadingFnOptions: AvailableSpreadingFunction[] = [
    AvailableSpreadingFunction.lines,
    AvailableSpreadingFunction.diamonds,
  ];

  readonly form = this.fb.group<PaintSettings>({
    stepPauseTime: [null, [Validators.required]],
    spreadingFn: [null, [Validators.required]],
    isCssAnimationsActive: [null],
  });

  @Input() value: PaintSettings;
  @Output() changed = new EventEmitter<PaintSettings>();

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.form.valueChanges.pipe(
      distinctUntilChanged(isEqual),
      filter(() => this.form.valid),
      tap(() => this.changed.emit(this.form.value)),
    ).subscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.form.patchValue(this.value);
    }
  }

  onStepPauseChange(event: MatSliderChange) {
    this.form.controls.stepPauseTime.setValue(event.value);
  }
}
