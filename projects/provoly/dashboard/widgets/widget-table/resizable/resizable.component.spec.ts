import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResizableComponent } from './resizable.component';
import { ResizableDirective } from './resizable.directive';

describe('ResizableComponent', () => {
  let component: ResizableComponent;
  let fixture: ComponentFixture<ResizableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResizableComponent, ResizableDirective]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResizableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
