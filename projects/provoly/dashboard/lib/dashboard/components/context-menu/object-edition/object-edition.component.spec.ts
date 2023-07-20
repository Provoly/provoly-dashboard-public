import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryIconComponent } from '../../../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../../../mock/pipe/mock-i18n.pipe';
import { MockTranslatePipe } from '../../../../../mock/pipe/mock-translate.pipe';

import { PryObjectEditionComponent } from './object-edition.component';

describe('ObjectCreationComponent', () => {
  let component: PryObjectEditionComponent;
  let fixture: ComponentFixture<PryObjectEditionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PryObjectEditionComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore(), { provide: Overlay, useValue: {} }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PryObjectEditionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
