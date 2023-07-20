import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PryIconComponent } from './icon.component';

describe('PryIconComponent', () => {
  let component: PryIconComponent;
  let fixture: ComponentFixture<PryIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryIconComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
