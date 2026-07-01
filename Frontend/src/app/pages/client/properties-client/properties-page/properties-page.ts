import { Component, inject, signal } from '@angular/core';
import { PropertiesList } from '../properties-list/properties-list';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../../core/stores/post.store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-properties-page',
  imports: [
    PropertiesList,
    Pagination,
    FormsModule
  ],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  protected readonly store = inject(PostStore);

  readonly loading = this.store.loading;
  // readonly posts = this.store.allRealEstatePosts;
  readonly posts = this.store.filteredPosts;

  readonly sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  readonly selectedSort = signal('newest');

  ngOnInit() {
    this.store.isAdminMode.set(false); // Đảm bảo đang ở chế độ client
    this.store.setType('properties'); // Chỉ lấy các bài viết loại "project"
    this.store.loadAllRealEstatePosts(); // Sử dụng hàm mới để load tất cả bài đăng bất động sản công khai
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