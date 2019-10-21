import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from 'ngx-strongly-typed-forms';
import isEqual from 'lodash/isEqual';

import { GridSettings, AvailableGridEngine } from 'app/models';

@Component({
  selector: 'app-grid-settings-form',
  templateUrl: './grid-settings-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridSettingsFormComponent implements OnChanges {
  readonly engineOptions: Array<{ value: AvailableGridEngine, disabled: boolean }> = [
    { value: AvailableGridEngine.angular, disabled: false },
    { value: AvailableGridEngine.custom, disabled: true },
  ];

  readonly form = this.fb.group<GridSettings>({
    engine: [null, [Validators.required]],
    gridSizeX: [null, [Validators.required, Validators.min(1), Validators.pattern(/\d+/)]],
    gridSizeY: [null, [Validators.required, Validators.min(1), Validators.pattern(/\d+/)]],
  });

  @Input() value: GridSettings;
  @Output() applied = new EventEmitter<GridSettings>();

  get isFormValueChanged(): boolean {
    return !isEqual(this.form.value, this.value);
  }

  constructor(private readonly fb: FormBuilder) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value) {
      this.form.patchValue(this.value);
    }
  }

  onApplyClick() {
    this.applied.emit(this.form.value);
  }
}
