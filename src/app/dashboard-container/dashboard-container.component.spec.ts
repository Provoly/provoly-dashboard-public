import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockPryDashboardComponent } from '@provoly/dashboard/mock/components/mock-pry-dashboard.component';

import { DashboardContainerComponent } from './dashboard-container.component';
import { MockPryFilterGroupComponent } from '@provoly/dashboard/mock/components/mock-pry-filter-group.component';

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [provideMockStore()],
      declarations: [DashboardContainerComponent, MockPryDashboardComponent, MockPryFilterGroupComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
