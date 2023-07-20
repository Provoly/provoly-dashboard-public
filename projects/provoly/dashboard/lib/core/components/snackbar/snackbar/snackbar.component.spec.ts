import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';

import { PrySnackbarComponent } from './snackbar.component';

describe('SnackbarComponent', () => {
  let component: PrySnackbarComponent;
  let fixture: ComponentFixture<PrySnackbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrySnackbarComponent, MockPryIconComponent],
      imports: [BrowserAnimationsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
