import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../../core/stores/post.store';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';

@Component({
  selector: 'app-news-list-page',
  standalone: true,
  imports: [
    CommonModule,
    Pagination,
    FormsModule,
    LucideDynamicIcon,
    CustomInput,
    Button,
    RouterLink
  ],
  templateUrl: './news-list-page.html',
  styleUrl: './news-list-page.css',
})
export class NewsListPage implements OnInit {
  protected readonly postStore = inject(PostStore);

  readonly loading = this.postStore.loading;

  ngOnInit() {
    this.postStore.isAdminMode.set(false);
    this.postStore.setType('news'); // Chỉ lấy các bài viết loại "news"
  }

  onSearch(): void {
    this.postStore.searchPublic();
  }

  onPageChange(page: number): void {
    this.postStore.setPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}