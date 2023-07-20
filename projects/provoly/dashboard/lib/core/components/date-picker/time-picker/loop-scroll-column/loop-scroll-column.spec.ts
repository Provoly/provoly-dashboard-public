import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LoopScrollColumnComponent } from './loop-scroll-column.component';

describe('LoopScrollColumnComponent', () => {
  let component: LoopScrollColumnComponent;
  let fixture: ComponentFixture<LoopScrollColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [LoopScrollColumnComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoopScrollColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should emit selected item', () => {
    jest.spyOn(component.selection, 'emit');
    component.select(25);
    expect(component.selectedItem).toBe(25);
    fixture.detectChanges();
    expect(component.selection.emit).toHaveBeenCalledWith(25);
  });
});
