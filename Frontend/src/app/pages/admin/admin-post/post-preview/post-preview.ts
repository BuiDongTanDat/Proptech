import { Component, OnInit, OnDestroy, signal, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';

import { DatePipe } from '@angular/common';
import { PostStore } from '../../../../core/stores/post.store';
import { getPostStatusClass } from '../../../../shared/utils/helper';
import { AuthStore } from '../../../../core/stores/auth.store';
import { POST_PAGE_CONFIG, PostType, isPostType } from '../../../../core/config/post.config';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.html',
  imports: [Button, LucideDynamicIcon, DatePipe],
})
export class PostReview implements OnInit, OnDestroy {

  // Service 
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly store = inject(PostStore);
  protected readonly authStore = inject(AuthStore);

  // Signal
  private readonly blobUrl = signal<string | null>(null);
  protected readonly displayUrl = signal<SafeResourceUrl | null>(null);
  protected readonly leftOpen = signal(true);
  protected readonly postType = signal<PostType>('properties');

  // Lấy cấu hình dựa vào loại bài đăng hiện tại
  readonly currentConfig = computed(() => POST_PAGE_CONFIG[this.postType()]);

  // Xử lý giá trị động từ dữ liệu bài viết sang mảng hiển thị
  readonly previewFields = computed(() => {
    const config = this.currentConfig();
    const post = this.store.selectedPost();
    if (!post) return [];

    return config.fields.map(field => {
      let displayValue = '';

      if (field.key === 'category') {
        displayValue = post.category?.name || '';
      } else if (field.key === 'cover_picture') {
        displayValue = post.cover_picture?.url || '';
      } else {
        displayValue = (post as any)[field.key] || '';
      }

      return {
        ...field,
        value: displayValue
      };
    });
  });

  constructor() {
    effect((onCleanup) => {
      const post = this.store.selectedPost();

      // Nếu đang load hoặc chưa có post thì reset URL
      if (this.store.loading() || !post) {
        this.displayUrl.set(null);
        return;
      }

      const html = post.htmlSource;

      // Trường hợp bài viết không có nội dung HTML (vẫn cho phép xem thông tin sidebar và chỉnh sửa)
      if (!html || html.trim() === '') {
        this.displayUrl.set(null);
        return;
      }

      try {
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);

        this.blobUrl.set(url);
        this.displayUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));

        onCleanup(() => {
          if (url) URL.revokeObjectURL(url);
        });
      } catch (e) {
        console.error('Error creating preview blob:', e);
        this.displayUrl.set(null);
      }
    });
  }

  ngOnInit() {
    // 1. Lấy type từ URL
    const type = this.route.snapshot.paramMap.get('type');
    if (isPostType(type)) {
      this.postType.set(type);
      // QUAN TRỌNG: Phải cập nhật type vào Store để loadPostById gọi đúng API type tương ứng
      this.store.currentType.set(type === 'properties' ? 'properties' : type);
    }

    // 2. Load dữ liệu bài viết
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.loadPostById(id);
    }
  }

  ngOnDestroy() {
    if (this.blobUrl()) {
      URL.revokeObjectURL(this.blobUrl()!);
    }
  }

  toggleLeft(): void {
    this.leftOpen.update(v => !v);
  }

  protected onEdit(): void {
    const id = this.store.selectedPost()?._id;
    const type = this.postType() || 'properties';
    if (id) {
      this.router.navigate(['/admin/post', type, 'editor', id]);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/admin/post']);
  }

  protected getStatusClass(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-600';
    return getPostStatusClass(status as any);
  }
}