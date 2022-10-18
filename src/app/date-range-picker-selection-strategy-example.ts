import { Component, Injectable, Inject, Directive, Input } from "@angular/core";
import { DateAdapter } from "@angular/material/core";
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MatDatepicker,
  MatDateRangePicker,
  MAT_DATE_RANGE_SELECTION_STRATEGY
} from "@angular/material/datepicker";

@Injectable()
export class MaxRangeSelectionStrategy<D>
  implements MatDateRangeSelectionStrategy<D> {
  start: any;
  public delta: number;
  constructor(private _dateAdapter: DateAdapter<D>) {}

  selectionFinished(date: D, currentRange: DateRange<D>) {
    let { start, end } = currentRange;
    if (start == null || (start && end)) {
      start = date;
      end = null;
    } else if (end == null) {
      const maxDate = this._dateAdapter.addCalendarDays(start, this.delta);
      end = date ? (date > maxDate ? maxDate : date) : null;
    }

    return new DateRange<D>(start, end);
  }
  createPreview(
    activeDate: D | null,
    currentRange: DateRange<D>
  ): DateRange<D> {
    if (currentRange.start && !currentRange.end) {
      const maxDate = this._dateAdapter.addCalendarDays(
        currentRange.start,
        this.delta
      );
      const rangeEnd = activeDate
        ? activeDate > maxDate
          ? maxDate
          : activeDate
        : null;

      return new DateRange(currentRange.start, rangeEnd);
    }

    return new DateRange<D>(null, null);
  }
}

@Directive({
  selector: "[maxRange]",
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: MaxRangeSelectionStrategy
    }
  ]
})
export class MaxRangeDirective {
  constructor(
    @Inject(MAT_DATE_RANGE_SELECTION_STRATEGY)
    private maxRangeStrategy: MaxRangeSelectionStrategy<any>
  ) {}
  @Input() set maxRange(value: number) {
    this.maxRangeStrategy.delta = +value || 7;
  }
}

/** @title Date range picker with custom a selection strategy */
@Component({
  selector: "date-range-picker-selection-strategy-example",
  templateUrl: "date-range-picker-selection-strategy-example.html"
})
export class DateRangePickerSelectionStrategyExample {}

/**  Copyright 2020 Google LLC. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */
