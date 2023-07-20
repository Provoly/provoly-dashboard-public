import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { BaseFilterComponent } from '@provoly/dashboard';

@Component({
  selector: 'pry-list-filter',
  templateUrl: './list-filter.component.html'
})
export class ListFilterComponent extends BaseFilterComponent implements OnInit {
  possibleValues: string[] = [];

  constructor(store: Store) {
    super(store);
    this.type = 'list';
  }

  ngOnInit() {
    if (this.filter?.possibleValues) {
      this.possibleValues = [...new Set(this.filter?.possibleValues.split(',').map((value) => value.trim()))];
    }
  }

  setFilter(value: string) {
    if (value !== this.filter?.value) super.updateFilter(value);
  }
}
