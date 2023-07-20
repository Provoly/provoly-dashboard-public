import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockI18nPipe } from '@provoly/dashboard/mock/pipe/mock-i18n.pipe';
import { PryRangeComponent } from './range.component';

describe('RangeComponent', () => {
  let component: PryRangeComponent;
  let fixture: ComponentFixture<PryRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryRangeComponent, MockI18nPipe]
    }).compileComponents();
    fixture = TestBed.createComponent(PryRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
