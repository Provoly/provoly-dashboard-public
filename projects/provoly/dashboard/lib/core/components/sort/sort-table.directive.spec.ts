import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockPryIconComponent } from '../../../../mock/components/mock-pry-icon.component';
import { PrySortHeaderDirective } from './sort-header.directive';
import { PrySortHeaderComponent } from './sort-header/sort-header.component';
import { PrySortTableDirective } from './sort-table.directive';

@Component({
  template: ` <table prySortTable prySortActive="toto1" prySortDirection="asc">
    <thead>
      <th prySortHeader="toto1">TOTO1</th>
      <th prySortHeader="toto2">TOTO2</th>
      <th *ngIf="change" prySortHeader="toto3">TOTO2</th>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td></td>
        <td *ngIf="change"></td>
      </tr>
    </tbody>
  </table>`
})
class MockComponent {
  change = false;
}

describe('PrySortTableDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PrySortTableDirective,
        PrySortHeaderComponent,
        MockComponent,
        PrySortHeaderDirective,
        MockPryIconComponent
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set initial active sort', () => {
    const sortHeaders = fixture.debugElement.queryAll(By.directive(PrySortHeaderComponent));
    const firstSortHeader: PrySortHeaderComponent = sortHeaders[0].componentInstance;
    expect(firstSortHeader).toBeTruthy();
    expect(firstSortHeader.prySortHeader).toEqual('toto1');
    expect(firstSortHeader.prySortDirection).toEqual('asc');
    expect(firstSortHeader.prySortActive).toEqual(true);
  });
  it('should set initial active sort and change it to desc sort', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const debugElement = fixture.debugElement.query(By.directive(PrySortTableDirective));
    const directive = debugElement.injector.get(PrySortTableDirective);
    const spy = jest.spyOn(directive.prySortChange, 'emit');
    const sortHeadersByClass = fixture.debugElement.queryAll(By.css('.m-btn-sorttable__title'));
    sortHeadersByClass[0].nativeElement.click();
    const sortHeaders = fixture.debugElement.queryAll(By.directive(PrySortHeaderComponent));
    const firstSortHeader: PrySortHeaderComponent = sortHeaders[0].componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(firstSortHeader).toBeTruthy();
    expect(firstSortHeader.prySortHeader).toEqual('toto1');
    expect(firstSortHeader.prySortDirection).toEqual('desc');
    expect(firstSortHeader.prySortActive).toEqual(true);
    expect(spy.mock.calls).toEqual([[{ active: 'toto1', direction: 'desc' }]]);
  });
  it('should set no active sort after click two times', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    const debugElement = fixture.debugElement.query(By.directive(PrySortTableDirective));
    const directive = debugElement.injector.get(PrySortTableDirective);
    const spy = jest.spyOn(directive.prySortChange, 'emit');
    const sortHeadersByClass = fixture.debugElement.queryAll(By.css('.m-btn-sorttable__title'));
    sortHeadersByClass[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    sortHeadersByClass[0].nativeElement.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const sortHeaders = fixture.debugElement.queryAll(By.directive(PrySortHeaderComponent));
    const firstSortHeader: PrySortHeaderComponent = sortHeaders[0].componentInstance;
    expect(firstSortHeader).toBeTruthy();
    expect(firstSortHeader.prySortHeader).toEqual('toto1');
    expect(firstSortHeader.prySortDirection).toEqual(undefined);
    expect(firstSortHeader.prySortActive).toEqual(false);
    expect(spy.mock.calls).toEqual([[{ active: 'toto1', direction: 'desc' }], [{}]]);
  });
  it('should set initial active sort and change it to desc sort after content change', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    component.change = true;
    fixture.detectChanges();
    await fixture.whenStable();
    const debugElement = fixture.debugElement.query(By.directive(PrySortTableDirective));
    const directive = debugElement.injector.get(PrySortTableDirective);
    const spy = jest.spyOn(directive.prySortChange, 'emit');
    const sortHeadersByClass = fixture.debugElement.queryAll(By.css('.m-btn-sorttable__title'));
    sortHeadersByClass[2].nativeElement.click();
    const sortHeaders = fixture.debugElement.queryAll(By.directive(PrySortHeaderComponent));
    const firstSortHeader: PrySortHeaderComponent = sortHeaders[2].componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(firstSortHeader).toBeTruthy();
    expect(firstSortHeader.prySortHeader).toEqual('toto3');
    expect(firstSortHeader.prySortDirection).toEqual('asc');
    expect(firstSortHeader.prySortActive).toEqual(true);
    expect(spy.mock.calls).toEqual([[{ active: 'toto3', direction: 'asc' }]]);
  });
});
