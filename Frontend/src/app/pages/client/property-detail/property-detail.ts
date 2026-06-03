import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideDynamicIcon } from '@lucide/angular';
import { Subscription, finalize } from 'rxjs';
import { IPost } from '../../../core/models/model';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../core/stores/post.store';
import { PostService } from '../../../core/services/post.service';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, LucideDynamicIcon],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly postService = inject(PostService);
  protected readonly store = inject(PostStore);

  readonly previewUrl = signal<SafeResourceUrl | null>(null);
  readonly suggestedPosts = signal<IPost[]>([]);
  readonly suggestedLoading = signal(false);
  
  private blobUrl: string | null = null;
  private routeSubscription?: Subscription;

  constructor() {
    effect((onCleanup) => {
      const post = this.store.selectedPost();
      const html = post?.htmlSource;

      if (!html) {
        this.previewUrl.set(null);
        return;
      }

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      this.blobUrl = url;
      this.previewUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(url));

      onCleanup(() => {
        URL.revokeObjectURL(url);
      });
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.loadPostById(id);
        this.loadSuggestedPosts(id);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  goBack(): void {
    this.router.navigate(['/properties']);
  }

  protected loadSuggestedPosts(currentId: string): void {
    this.suggestedLoading.set(true);

    this.postService.getAllPosts(1, REAL_ESTATE_POST_ID)
      .pipe(finalize(() => this.suggestedLoading.set(false)))
      .subscribe({
        next: res => {
          const items = res.data ?? [];
          const filtered = items
            .filter(post => post._id && post._id !== currentId)
            .slice(0, 4);
          this.suggestedPosts.set(filtered);
        },
        error: () => {
          this.suggestedPosts.set([]);
        }
      });
  }

  // Tự động thay đổi chiều cao iframe tương ứng với nội dung HTML bên trong
  protected onIframeLoad(event: Event): void {
    const iframe = event.target as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        iframe.style.height = '0px'; // Reset chiều cao tạm thời để tính toán chuẩn xác
        const doc = iframe.contentWindow.document;
        const height = Math.max(
          doc.body.scrollHeight,
          doc.documentElement.scrollHeight
        );
        iframe.style.height = `${height}px`;
      } catch (error) {
        // Phương án dự phòng nếu gặp lỗi phân tích kích thước
        iframe.style.height = '100vh';
      }
    }
  }
}