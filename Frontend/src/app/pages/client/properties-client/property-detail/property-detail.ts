import { Component, OnDestroy, OnInit, effect, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { LucideDynamicIcon } from '@lucide/angular';
import { Subscription, finalize } from 'rxjs';
import { IPost } from '../../../../core/models/model';
import { PostStore, REAL_ESTATE_POST_ID } from '../../../../core/stores/post.store';
import { PostService } from '../../../../core/services/post.service';
import { ContactsStore } from '../../../../core/stores/contacts.store';
import { ToastService } from '../../../../core/services/toast.service';
import { SanitizeHtmlPipe } from '../../../../core/pipes/sanitize-html.pipe';

@Component({
  selector: 'app-property-detail',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink, LucideDynamicIcon, SanitizeHtmlPipe],
  templateUrl: './property-detail.html',
  styleUrls: ['./property-detail.css']
})
export class PropertyDetail implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly postService = inject(PostService);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(PostStore);
  protected readonly contactsStore = inject(ContactsStore);

  // Sử dụng SafeHtml thay vì SafeResourceUrl để dùng với [srcdoc]
  readonly safeHtml = signal<string>('');
  readonly suggestedPosts = signal<IPost[]>([]);
  readonly suggestedLoading = signal(false);
  readonly iframeVisible = signal(false); // Flag để ẩn iframe cho đến khi nó load xong

  private routeSubscription?: Subscription;

  constructor() {
    effect(() => {
      const post = this.store.selectedPost();

      if (post?.htmlSource) {
        this.safeHtml.set(post.htmlSource);
        this.iframeVisible.set(false);
      } else {
        this.safeHtml.set('');
        this.iframeVisible.set(true); // Nếu không có htmlSource, hiển thị iframe mặc định (có thể là một thông báo lỗi hoặc placeholder)
      }
    });
  }

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        window.scrollTo(0, 0);
        this.store.loadPostById(id);
        this.loadSuggestedPosts(id);
      }
    });
  }

  ngOnDestroy(): void {
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
        error: () => this.suggestedPosts.set([])
      });
  }



  protected onIframeLoad(event: Event): void {
    const iframe = event.target as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      try {
        const doc = iframe.contentWindow.document;
        // Tính toán chiều cao ngay lập tức
        const updateHeight = () => {
          const height = doc.documentElement.scrollHeight;
          iframe.style.height = `${height}px`;
          this.iframeVisible.set(true); // Chỉ hiển thị sau khi đã tính được chiều cao
        };

        const images = Array.from(doc.images);

        if (images.length === 0) {
          updateHeight();
          return;
        }

        let loadedImages = 0;

        images.forEach(img => {
          if (img.complete) {
            loadedImages++;
          } else {
            img.addEventListener('load', () => {
              loadedImages++;

              if (loadedImages === images.length) {
                updateHeight();
              }
            });
          }
        });

        if (loadedImages === images.length) {
          updateHeight();
        }

        doc.addEventListener('click', (e: MouseEvent) => this.handleIframeClick(e, doc));
        doc.addEventListener('keydown', (e: KeyboardEvent) => this.handleIframeKeyDown(e, doc));
      } catch (error) {
        iframe.style.height = '100vh';
        this.iframeVisible.set(true);
      }
    }
  }

  // --- Giữ nguyên các hàm handleIframeClick, handleIframeKeyDown, submitIframeForm ---
  private handleIframeClick(event: MouseEvent, doc: Document): void {
    const target = event.target as HTMLElement;
    const submitButton = target.closest('button[data-action="emit-contact-form"]') as HTMLButtonElement | null;
    if (submitButton) {
      event.preventDefault();
      this.submitIframeForm(submitButton, doc);
    }
  }

  private handleIframeKeyDown(event: KeyboardEvent, doc: Document): void {
    const target = event.target as HTMLElement;
    if ((target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') && target.tagName !== 'TEXTAREA' && event.key === 'Enter') {
      const formContainer = target.closest('div');
      const submitButton = formContainer?.querySelector('button[data-action="emit-contact-form"]') as HTMLButtonElement | null;
      if (submitButton) {
        event.preventDefault();
        this.submitIframeForm(submitButton, doc);
      }
    }
  }

  private submitIframeForm(button: HTMLButtonElement, doc: Document): void {
    const formContainer = button.closest('div');
    if (!formContainer) return;

    const nameInput = formContainer.querySelector('input[type="text"]') as HTMLInputElement | null;
    const phoneInput = formContainer.querySelector('input[type="tel"]') as HTMLInputElement | null;
    const messageInput = formContainer.querySelector('textarea') as HTMLTextAreaElement | null;

    const name = nameInput?.value?.trim() ?? '';
    const phone = phoneInput?.value?.trim() ?? '';
    if (!name || !phone) {
      this.toastService.error(!name ? 'Vui lòng nhập họ tên' : 'Vui lòng nhập số điện thoại');
      return;
    }

    this.contactsStore.addContact({ name, phone, message: messageInput?.value ?? '', post: this.store.selectedPost()?._id! })
      .subscribe(() => {
        if (nameInput) nameInput.value = '';
        if (phoneInput) phoneInput.value = '';
        if (messageInput) messageInput.value = '';
      });
  }
}