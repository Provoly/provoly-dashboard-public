import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ResizableComponent } from './resizable.component';
import { ResizableDirective } from './resizable.directive';

@Component({
  template: ` <table>
    <thead>
      <th resizable></th>
      <th resizable></th>
    </thead>
    <tbody>
      <tr>
        <td></td>
        <td></td>
      </tr>
    </tbody>
  </table>`
})
class MockComponent {}

describe('ResizableDirective', () => {
  let component: MockComponent;
  let fixture: ComponentFixture<MockComponent>;
  let firstTh: DebugElement;
  let elementResizable: DebugElement;
  let directive: DebugElement;

  function programmaticTrigger(eventType: string, evtObj: any) {
    let evt = new MouseEvent(eventType, evtObj);
    document.dispatchEvent(evt);
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResizableDirective, ResizableComponent, MockComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    elementResizable = fixture.debugElement.query(By.css('.bar'));
    firstTh = fixture.debugElement.query(By.css('th'));
    directive = fixture.debugElement.query(By.directive(ResizableDirective));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resize it column size', () => {
    expect(elementResizable).not.toBeNull();
    expect(directive).not.toBeNull();
    elementResizable.nativeElement.dispatchEvent(new Event('mousedown'));
    programmaticTrigger('mousemove', { clientX: 100, clientY: 0 });
    programmaticTrigger('mouseup', null);
    fixture.detectChanges();
    expect(getComputedStyle(firstTh.nativeElement).width).toBe('100px');
  });
});
