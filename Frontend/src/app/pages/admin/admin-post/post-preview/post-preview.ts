import { Component, OnInit, OnDestroy, signal, inject, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';

import { DatePipe } from '@angular/common';
import { PostStore } from '../../../../core/stores/post.store';
import { getPostStatusClass } from '../../../../shared/utils/helper';
import { AuthStore } from '../../../../core/stores/auth.store';

@Component({
  selector: 'app-post-preview',
  templateUrl: './post-preview.html',
  imports: [Button, LucideDynamicIcon, DatePipe],
})
export class PostReview implements OnInit, OnDestroy {

  //Service 
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router)
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly store = inject(PostStore);
  protected readonly authStore = inject(AuthStore);


  //Signal
  private readonly blobUrl = signal<string | null>(null);
  protected readonly displayUrl = signal<SafeResourceUrl | null>(null);
  protected readonly leftOpen = signal(true);

  constructor() {
    // Sử dụng effect để theo dõi thay đổi của selectedPost
    effect((onCleanup) => {
      const post = this.store.selectedPost();
      const html = post?.htmlSource;

      if (!html) {
        this.displayUrl.set(null);
        return;
      }

      // 1. Tạo Blob và URL
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);

      // 2. Cập nhật signal displayUrl
      this.displayUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));

      // 3. onCleanup sẽ tự động chạy trước khi effect chạy lại lần sau 
      // hoặc khi component bị destroy.
      onCleanup(() => {
        URL.revokeObjectURL(url);
        console.log('Đã giải phóng Blob URL cũ');
      });
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.store.loadPostById(id); // Tải bài viết dựa trên ID từ URL từ Poststore
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
    if (id) {
      this.router.navigate(['/admin/post/editor', id]);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/admin/post']);
  }

  // Sử dụng helper dùng chung để đồng bộ màu sắc status toàn app
  protected getStatusClass(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-600';
    return getPostStatusClass(status as any);
  }
}