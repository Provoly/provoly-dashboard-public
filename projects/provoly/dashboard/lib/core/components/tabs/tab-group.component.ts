import { AfterContentInit, Component, ContentChildren, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { TabComponent } from './tab.component';

@Component({
  selector: 'pry-tab-group',
  templateUrl: './tab-group.component.html'
})
export class TabGroupComponent implements AfterContentInit {
  @Input() translationStringBase = '';
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  currentTab!: TabComponent;
  currentTabIndex = 0;
  static instanceId = 0;

  @Output() clickedTabIdx = new EventEmitter<number>();

  get instanceId() {
    return TabGroupComponent.instanceId;
  }

  constructor() {
    TabGroupComponent.instanceId++;
  }

  ngAfterContentInit() {
    this.currentTab = this.tabs.first;
    this.tabs.forEach((tab, i) => (tab.index = i));
  }

  switch(tab: TabComponent, index: number) {
    this.currentTab = tab;
    this.currentTabIndex = index;
    this.clickedTabIdx.emit(index);
  }
}
