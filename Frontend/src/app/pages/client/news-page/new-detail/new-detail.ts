import { ChangeDetectionStrategy, Component, effect, inject, signal, computed, DestroyRef, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Thêm ActivatedRoute
import { LucideDynamicIcon } from '@lucide/angular';
import { Subscription, finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'; // Thêm helper quản lý subscription
import { SanitizeHtmlPipe } from '../../../../core/pipes/sanitize-html.pipe';
import { PostService } from '../../../../core/services/post.service';
import { PostStore } from '../../../../core/stores/post.store';
import { ContactsStore } from '../../../../core/stores/contacts.store';
import { IPost } from '../../../../core/models/model';

@Component({
  selector: 'app-new-detail',
  imports: [
    DatePipe,
    RouterLink,
    LucideDynamicIcon,
    SanitizeHtmlPipe
  ],
  templateUrl: './new-detail.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewDetail implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute); // Inject ActivatedRoute để lấy tham số URL
  private readonly postService = inject(PostService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly store = inject(PostStore);
  protected readonly contactsStore = inject(ContactsStore);

  // Trạng thái phái sinh (Derived State)
  readonly safeHtml = computed(() => this.store.selectedPost()?.htmlSource ?? '');
  readonly suggestedPosts = signal<IPost[]>([]);
  readonly suggestedLoading = signal(false);
  readonly iframeVisible = signal(false);

  private suggestionsSubscription?: Subscription;

  constructor() {
    this.store.isAdminMode.set(false);
    this.store.currentType.set('news');
  }

  ngOnInit(): void {
    // Đăng ký theo dõi sự thay đổi của tham số 'id' trên URL
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.loadPostAndSuggestions(id);
        }
      });
  }

  private loadPostAndSuggestions(id: string): void {
    // 1. Gọi store để tải chi tiết bài viết công khai
    this.store.loadPublicPostById(id);

    // 2. Tải danh sách bài viết gợi ý liên quan
    this.loadSuggestedPosts(id, 'news');
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }

  protected loadSuggestedPosts(currentId: string, type: string): void {
    // Hủy request cũ đang chạy để tránh ghi đè dữ liệu do bất đồng bộ
    this.suggestionsSubscription?.unsubscribe();

    this.suggestedLoading.set(true);
    this.suggestionsSubscription = this.postService.getAllPublicPosts(type)
      .pipe(
        finalize(() => this.suggestedLoading.set(false))
      )
      .subscribe({
        next: res => {
          const items = res.data.posts ?? [];
          const filtered = items
            .filter(post => post._id && post._id !== currentId)
            .slice(0, 4);
          this.suggestedPosts.set(filtered);
        },
        error: () => this.suggestedPosts.set([])
      });
  }

  protected onIframeLoad(event: Event): void {
  const iframe = event.target as HTMLIFrameElement;
  if (iframe && iframe.contentWindow) {
    try {
      const doc = iframe.contentWindow.document;

      // 1. Loại bỏ margin/padding dư thừa và ẩn thanh cuộn bên trong iframe
      const style = doc.createElement('style');
      style.textContent = `
        html, body {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: auto;
        }
      `;
      doc.head.appendChild(style);

      const updateHeight = () => {
        // 2. Reset độ cao về 0 trước khi đo để trình duyệt tính toán lại chính xác
        iframe.style.height = '0px';
        
        // Sử dụng chiều cao của body hoặc documentElement tùy theo cấu trúc nội dung
        const height = doc.body ? doc.body.scrollHeight : doc.documentElement.scrollHeight;
        
        iframe.style.height = `${height}px`;
        this.iframeVisible.set(true);
      };

      const images = Array.from(doc.images);
      if (images.length === 0) {
        updateHeight();
        return;
      }

      let loadedImages = 0;
      const onImageLoadOrError = () => {
        loadedImages++;
        if (loadedImages === images.length) {
          updateHeight();
        }
      };

      // Theo dõi cả sự kiện load thành công và thất bại của ảnh để tránh treo giao diện
      images.forEach(img => {
        if (img.complete) {
          onImageLoadOrError();
        } else {
          img.addEventListener('load', onImageLoadOrError);
          img.addEventListener('error', onImageLoadOrError);
        }
      });
    } catch {
      // Fallback khi gặp lỗi bảo mật (Cross-Origin) hoặc lỗi biên dịch khác
      iframe.style.height = 'auto';
      this.iframeVisible.set(true);
    }
  }
}
}