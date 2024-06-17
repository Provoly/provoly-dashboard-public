import { Overlay } from '@angular/cdk/overlay';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { EditNamedQueryModalComponent } from './edit-named-query-modal.component';
import { MockOverlay } from '@provoly/dashboard/mock/service/mock-overlay.service';

describe('EditNamedQueryModalComponent', () => {
  let component: EditNamedQueryModalComponent;
  let fixture: ComponentFixture<EditNamedQueryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditNamedQueryModalComponent],
      providers: [provideMockStore(), { provide: Overlay, useValue: MockOverlay }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNamedQueryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
