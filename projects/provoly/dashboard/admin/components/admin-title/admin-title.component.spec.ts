import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject } from 'rxjs';
import { MockPryIconComponent } from '../../../mock/components/mock-pry-icon.component';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';

import { AdminTitleComponent } from './admin-title.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

describe('AdminTitleComponent', () => {
  let component: AdminTitleComponent;
  let fixture: ComponentFixture<AdminTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminTitleComponent, MockTranslatePipe, MockPryIconComponent, MockI18nPipe],
      providers: [provideMockStore({}), { provide: ActivatedRoute, useValue: { data: new BehaviorSubject<any>({}) } }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
