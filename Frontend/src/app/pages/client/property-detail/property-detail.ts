import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LucideDynamicIcon } from '@lucide/angular';
import { Subscription, finalize } from 'rxjs';
import { IPost } from '../../../core/models/model';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../core/stores/post.store';
import { PostService } from '../../../core/services/post.service';
import { ContactsStore } from '../../../core/stores/contacts.store';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-property-detail',
  imports: [CommonModule, DatePipe, RouterLink, LucideDynamicIcon],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly postService = inject(PostService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(PostStore);
  protected readonly contactsStore = inject(ContactsStore);

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
          const items = res.data.posts ?? [];
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

  /**
   * Tự động thay đổi chiều cao iframe tương ứng với nội dung HTML bên trong,
   * đồng thời đăng ký bộ lắng nghe sự kiện thao tác biểu mẫu trong iframe.
   */
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

        // Gắn bộ lắng nghe sự kiện trực tiếp vào bên trong tài liệu của iframe
        doc.addEventListener('click', (e: MouseEvent) => this.handleIframeClick(e, doc));
        doc.addEventListener('keydown', (e: KeyboardEvent) => this.handleIframeKeyDown(e, doc));

      } catch (error) {
        // Phương án dự phòng nếu gặp lỗi phân tích kích thước
        iframe.style.height = '100vh';
      }
    }
  }

  /**
   * Xử lý sự kiện click chuột bên trong tài liệu của iframe
   */
  private handleIframeClick(event: MouseEvent, doc: Document): void {
    const target = event.target as HTMLElement;
    const submitButton = target.closest('button[data-action="emit-contact-form"]') as HTMLButtonElement | null;

    if (submitButton) {
      event.preventDefault();
      this.submitIframeForm(submitButton, doc);
    }
  }

  /**
   * Xử lý sự kiện nhấn Enter trong khi nhập liệu bên trong iframe
   */
  private handleIframeKeyDown(event: KeyboardEvent, doc: Document): void {
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

    if (isInputField && target.tagName !== 'TEXTAREA' && event.key === 'Enter') {
      const formContainer = target.closest('div');
      if (formContainer) {
        const submitButton = formContainer.querySelector('button[data-action="emit-contact-form"]') as HTMLButtonElement | null;
        if (submitButton) {
          event.preventDefault();
          this.submitIframeForm(submitButton, doc);
        }
      }
    }
  }

  /**
   * Thu thập dữ liệu và gửi yêu cầu tạo liên hệ
   */
  private submitIframeForm(button: HTMLButtonElement, doc: Document): void {
    const formContainer = button.closest('div');
    if (!formContainer) return;

    const nameInput = formContainer.querySelector('input[type="text"]') as HTMLInputElement | null;
    const phoneInput = formContainer.querySelector('input[type="tel"]') as HTMLInputElement | null;
    const messageInput = formContainer.querySelector('textarea') as HTMLTextAreaElement | null;

    const name = nameInput?.value?.trim() ?? '';
    const phone = phoneInput?.value?.trim() ?? '';
    const message = messageInput?.value?.trim() ?? '';

    if (!name) {
      this.toastService.error('Vui lòng nhập họ và tên');
      nameInput?.focus();
      return;
    }

    if (!phone) {
      this.toastService.error('Vui lòng nhập số điện thoại');
      phoneInput?.focus();
      return;
    }

    const phoneRegex = /^[0-9+]{9,15}$/;
    if (!phoneRegex.test(phone)) {
      this.toastService.error('Số điện thoại không đúng định dạng');
      phoneInput?.focus();
      return;
    }

    const currentPost = this.store.selectedPost();
    if (!currentPost?._id) {
      this.toastService.error('Không tìm thấy thông tin bài viết');
      return;
    }

    this.contactsStore.addContact({
      name,
      phone,
      message,
      post: currentPost._id
    }).subscribe({
      next: () => {
        // Làm rỗng dữ liệu các ô nhập bên trong iframe sau khi tạo thành công
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (messageInput) messageInput.value = '';
      }
    });
  }
}