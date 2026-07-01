import { Component, inject, signal } from '@angular/core';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { FormsModule } from '@angular/forms';
import { LucideAArrowDown, LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../../core/stores/post.store';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recruitments-list-page',
  imports: [
    Pagination,
    FormsModule,
    LucideDynamicIcon,
    CustomInput,
    Button,
    RouterLink
  ],
  templateUrl: './recruitment-list-page.html',
  styleUrl: './recruitment-list-page.css',
})
export class recruitmentsListPage {
  protected readonly postStore = inject(PostStore);

  readonly loading = this.postStore.loading;
  readonly sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
  ];

  readonly selectedSort = signal('newest');


  ngOnInit() {
    this.postStore.isAdminMode.set(false); // Đảm bảo đang ở chế độ client
    this.postStore.setType('jobs'); // Chỉ lấy các bài viết loại "jobs"


  }

  onSearch(): void {
    this.postStore.search();
  }

  onSortChange(sort: string): void {
    this.selectedSort.set(sort);
    this.postStore.setSort(sort);
  }

  onPageChange(page: number): void {
    this.postStore.setPage(page);
  }
}
