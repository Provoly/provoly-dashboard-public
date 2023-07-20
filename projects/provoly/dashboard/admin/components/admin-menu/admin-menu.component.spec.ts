import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMenuComponent } from './admin-menu.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AdminMenuComponent', () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AdminMenuComponent],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
