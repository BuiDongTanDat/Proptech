import { Component, inject, signal } from '@angular/core';
import { PropertiesList } from '../properties-list/properties-list';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../../core/stores/post.store';

@Component({
  selector: 'app-properties-page',
  imports: [
    PropertiesList,
    Pagination
  ],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  protected readonly store = inject(PostStore);

  readonly loading = this.store.loading;
  readonly posts = this.store.filteredPosts;

  readonly sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  readonly selectedSort = signal('newest');

  constructor() {
    this.store.selectedCategory.set(REAL_ESTATE_POST_ID);
    this.store.loadPosts();
  }

  onSearch(): void {
    this.store.search();
  }

  onSortChange(sort: string): void {
    this.selectedSort.set(sort);
    this.store.setSort(sort);
  }

  onPageChange(page: number): void {
    this.store.setPage(page);
  }
}