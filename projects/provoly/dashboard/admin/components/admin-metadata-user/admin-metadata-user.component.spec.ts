import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { provideMockStore } from '@ngrx/store/testing';
import { PryI18nService } from '@provoly/dashboard';
import { MetadataSelectors } from '@provoly/dashboard/components/metadata-editor';
import { MockI18nPipe } from '../../../mock/pipe/mock-i18n.pipe';
import { PryListMetadataModule } from '../admin-metadata/shared/list-metadata/list-metadata.module';
import { AdminMetadataUserComponent } from './admin-metadata-user.component';

@Pipe({ name: 'translate' })
class MockTranslatePipe implements PipeTransform {
  transform(value: number): number {
    return value;
  }
}

@Pipe({ name: 'prySortData' })
class MockPrySortData implements PipeTransform {
  transform(value: []): [] {
    return value;
  }
}

const metadata = [
  {
    id: '9d9aba2c-fc3a-44d7-a508-287ad2d8cbb0',
    name: '_class',
    type: 'UUID'
  },
  {
    id: 'e1e55abd-2fb7-4e3b-9372-92c7c9d6c5c4',
    name: '_date_modification',
    type: 'DATE'
  },
  {
    id: 'ba681f33-fe70-42f8-a277-05c607ba29cf',
    name: 'vigipirate',
    type: 'INTEGER'
  }
];

describe('AdminUtilisateurComponent', () => {
  PryI18nService.warn = false;
  let component: AdminMetadataUserComponent;
  let fixture: ComponentFixture<AdminMetadataUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminMetadataUserComponent, MockPrySortData, MockTranslatePipe, MockI18nPipe],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: MetadataSelectors.userProfile,
              value: metadata
            }
          ]
        }),
        { provide: ActivatedRoute, useValue: {} }
      ],
      imports: [PryListMetadataModule, FormsModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMetadataUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
