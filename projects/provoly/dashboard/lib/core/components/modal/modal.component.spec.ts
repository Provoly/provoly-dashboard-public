import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PryModalComponent } from './modal.component';

describe('PryModalComponent', () => {
  let component: PryModalComponent;
  let fixture: ComponentFixture<PryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryModalComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
