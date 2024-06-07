import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminDatasetActions } from '../../admin-dataset/store/admin-dataset.actions';
import { Category, CategoryActions, CategorySelectors } from '@provoly/dashboard';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { AdminDatasetSelectors } from '../../admin-dataset/store/admin-dataset.selectors';
import { Store } from '@ngrx/store';
import { v4 as uuid } from 'uuid';
import { AdminClassActions } from '../../admin-classes/store/admin-class.actions';

@Component({
  selector: 'pry-add-category-modal',
  templateUrl: './add-category-modal.component.html'
})
export class AddCategoryModalComponent implements OnInit {
  categories$!: Observable<Category[]>;
  filteredCategories$!: Observable<Category[]>;
  catToAdd = {
    id: uuid(),
    name: ''
  };
  search$ = new BehaviorSubject<string | undefined>(undefined);

  @Input({ required: true }) entityType!: 'attribute' | 'dataset';
  @Output() closeModal = new EventEmitter<void>();
  @Output() category = new EventEmitter<Category>();

  actions = {
    attribute: {
      load: () => this.store.dispatch(CategoryActions.load()),
      select: () => this.store.select(CategorySelectors.categories),
      add: (category: Category) => this.store.dispatch(AdminClassActions.saveCategory({ category }))
    },
    dataset: {
      load: () => this.store.dispatch(AdminDatasetActions.getCategories()),
      select: () => this.store.select(AdminDatasetSelectors.categories),
      add: (category: Category) => this.store.dispatch(AdminDatasetActions.addCategory({ category }))
    }
  };

  constructor(private store: Store<any>) {}

  ngOnInit() {
    this.loadCategories();
    this.categories$ = this.selectCategories();
    this.filteredCategories$ = combineLatest([this.categories$, this.search$]).pipe(
      map(([categories, search]) =>
        search
          ? categories.filter((category) => category.name.toLowerCase().includes(search?.toLowerCase()))
          : categories
      )
    );
  }

  loadCategories(): void {
    this.actions[this.entityType].load();
  }

  selectCategories(): Observable<Category[]> {
    return this.actions[this.entityType].select();
  }

  addCategory(): void {
    this.actions[this.entityType].add(this.catToAdd);
    this.selectCategory(this.catToAdd);
  }

  selectCategory(category: Category) {
    this.category.emit(category);
    this.closeModal.emit();
  }

  search($event: Event) {
    this.search$.next(($event.target as HTMLInputElement).value);
  }
}
