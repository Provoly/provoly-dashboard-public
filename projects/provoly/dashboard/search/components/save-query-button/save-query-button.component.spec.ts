import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../mock/pipe/mock-translate.pipe';

describe('PrySaveQueryButtonComponent', () => {
  let component: PrySaveQueryButtonComponent;
  let fixture: ComponentFixture<PrySaveQueryButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrySaveQueryButtonComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [
        {
          provide: PryDialogService,
          useValue: {
            open: () => {}
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrySaveQueryButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
