import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryBaseToolboxComponent } from '../../../mock/components/mock-pry-base-toolbox.component';
import { AdminLayoutComponent } from './admin-layout.component';

@Component({
  selector: 'pry-admin-title',
  template: '<p>Mock</p>'
})
class MockPryAdminTitleComponent {}

@Component({
  selector: 'pry-admin-menu',
  template: '<p>Mock</p>'
})
class MockPryAdminMenuComponent {}

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        AdminLayoutComponent,
        MockPryAdminTitleComponent,
        MockPryBaseToolboxComponent,
        MockPryAdminMenuComponent
      ],
      providers: [provideMockStore({})]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
