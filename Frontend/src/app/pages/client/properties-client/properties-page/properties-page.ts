
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { PropertiesSidebar } from '../properties-sidebar/properties-sidebar';
import { PropertiesList } from '../properties-list/properties-list';
import { CheckTag } from '../../../../shared/components/check-tag/check-tag';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { PostStore } from '../../../../core/stores/post.store';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-properties-page',
  imports: [
    PropertiesSidebar,
    PropertiesList,
    Pagination,
    CheckTag,
    Dropdown,
    CommonModule,
    Dropdown,
    FormsModule
  ],
  templateUrl: './properties-page.html',
  styleUrl: './properties-page.css',
})
export class PropertiesPage {
  private postStore = inject(PostStore);

  // Filter state
  // Filter state (location, developer)
  filters = signal({
    location: '',
    developer: ''
  });
  // Lấy danh sách categories và selectedCategory từ store
  categories = this.postStore.categories;
  selectedCategory = this.postStore.selectedCategory;


  // Pagination
  currentPage = signal(1);
  pageSize = 12;

  // Sort options (có thể mở rộng sau)
  sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  categoryOptions = computed(() => [
    { label: 'Tất cả danh mục', value: 'all' },
    ...this.categories().map(c => ({
      label: c.name,
      value: c._id!
    }))
  ]);

  selectedSort = signal('newest');

  // Lấy danh sách bài viết từ store
  posts = this.postStore.filteredPosts;

  // Lọc theo location và developer (không lọc category ở đây nữa)
  filteredProperties = computed(() => {
    let result = this.posts();
    const { location, developer } = this.filters();
    if (location) {
      result = result.filter(p => p.location?.toLowerCase().includes(location.toLowerCase()));
    }
    if (developer) {
      result = result.filter(p => p.developer?.toLowerCase().includes(developer.toLowerCase()));
    }
    // Sắp xếp
    if (this.selectedSort() === 'newest') {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
        const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
        return dateB.getTime() - dateA.getTime();
      });
    } else if (this.selectedSort() === 'oldest') {
      result = [...result].sort((a, b) => {
        const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
        const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
        return dateA.getTime() - dateB.getTime();
      });
    }
    return result;
  });

  onCategoryChange(value: string) {
    this.postStore.setCategory(value);
    this.currentPage.set(1);
  }

  // Phân trang
  pagedProperties = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredProperties().slice(start, start + this.pageSize);
  });

  get totalPages() {
    return Math.ceil(this.filteredProperties().length / this.pageSize) || 1;
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  onLocationChange(value: string) {
    this.filters.update(f => ({ ...f, location: value }));
    this.currentPage.set(1);
  }

  onDeveloperChange(value: string) {
    this.filters.update(f => ({ ...f, developer: value }));
    this.currentPage.set(1);
  }

  onSortChange(value: string) {
    this.selectedSort.set(value);
    this.currentPage.set(1);
  }

  // Gọi khi khởi tạo để load dữ liệu
  constructor() {
    this.postStore.loadCategories();
    this.postStore.loadPosts();
  }
}
