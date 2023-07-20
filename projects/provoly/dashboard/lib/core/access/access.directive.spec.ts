import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { PryAccessDirective } from './access.directive';
import { PRY_ACCESS_TOKEN, PryBaseAccess, PryDefaultAccessService } from './access.service';

@Component({
  template: ` <div *pryAccess="{ module: 'module' }">
    <span class="span">span</span>
  </div>`
})
class MockComponent {
  change = false;
}

class MockAccessService implements PryBaseAccess {
  hasRole(...args: any[]): Observable<boolean> {
    const value = args[1] === 'module';
    return of(value);
  }
}

describe('PryAccessDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryAccessDirective, MockComponent],
      providers: [{ provide: PRY_ACCESS_TOKEN, useClass: PryDefaultAccessService }]
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
  it('should render span', async () => {
    const span = fixture.debugElement.query(By.css('.span'));
    const debugElement = fixture.debugElement.queryAllNodes(By.directive(PryAccessDirective))[0];
    const directive = debugElement.injector.get(PryAccessDirective);
    await fixture.whenStable();
    expect(span).toBeTruthy();
    expect(directive).toBeTruthy();
  });
});

describe('PryAccessDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryAccessDirective, MockComponent],
      providers: [{ provide: PRY_ACCESS_TOKEN, useClass: MockAccessService }]
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
  it('should change render span', async () => {
    const span = fixture.debugElement.query(By.css('.span'));
    expect(span).toBeTruthy();
    const debugElement = fixture.debugElement.queryAllNodes(By.directive(PryAccessDirective))[0];
    const directive = debugElement.injector.get(PryAccessDirective);
    directive.authorizedRoles = { module: 'notModule' };
    await fixture.whenStable();
    const notSpan = fixture.debugElement.query(By.css('.span'));
    expect(notSpan).toBeNull();
    expect(directive).toBeTruthy();
  });
});
