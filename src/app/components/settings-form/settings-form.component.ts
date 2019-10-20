import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from 'ngx-strongly-typed-forms';
import isEqual from 'lodash/isEqual';

import { Settings, AvailableGridEngine, AvailableSpreadingFunction, defaultSettings } from 'app/models';

@Component({
  selector: 'app-settings-form',
  templateUrl: './settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsFormComponent implements OnChanges {
  readonly engineOptions: AvailableGridEngine[] = [
    AvailableGridEngine.angular,
    AvailableGridEngine.custom,
  ];

  readonly spreadingFnOptions: AvailableSpreadingFunction[] = [
    AvailableSpreadingFunction.lines,
    AvailableSpreadingFunction.diamond,
  ];

  readonly form = this.fb.group<Settings>({
    engine: [null, [Validators.required]],
    gridSizeX: [null, [Validators.required, Validators.min(1), Validators.pattern(/\d+/)]],
    gridSizeY: [null, [Validators.required, Validators.min(1), Validators.pattern(/\d+/)]],
    spreadingSpeed: [null, [Validators.required]],
    spreadingFn: [null, [Validators.required]],
  });

  @Input() value: Settings;
  @Output() applied = new EventEmitter<Settings>();

  get isFormValueDefault(): boolean {
    return !isEqual(this.form.value, defaultSettings);
  }

  get isFormValueChanged(): boolean {
    return !isEqual(this.form.value, this.value);
  }

  constructor(private readonly fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.form.patchValue(this.value);
    }
  }

  onResetClick() {
    this.form.setValue(defaultSettings);
  }

  onApplyClick() {
    this.applied.emit(this.form.value);
  }
}
