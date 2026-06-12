import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailEditorComponent, EmailEditorModule } from 'angular-email-editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '../../../shared/components/ui/button/button';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { PROPERTY_STATUS_OPTIONS } from '../../../core/constants/post.constant';
import { PostStore } from '../../../core/stores/post.store';
import { PropertyStatus } from '../../../core/enum/enums';
import { ToastService } from '../../../core/services/toast.service';
import { CategoryStore } from '../../../core/stores/category.store';
import { contactFormTemplate, contactFormTemplateDesign, getPostStatusClass } from '../../../shared/utils/helper';
import { AuthStore } from '../../../core/stores/auth.store';
import { ConfirmDialog } from '../../../shared/components/confirm-dialog/confirm-dialog';
import { CustomTextarea } from '../../../shared/components/ui/custom-textarea/custom-textarea';
import { DatePipe } from '@angular/common';

type SaveMode = 'draft' | 'publish' | 'update' | 'create';

interface PostForm {
  title: FormControl<string>;
  developer: FormControl<string>;
  location: FormControl<string>;
  region: FormControl<string>;
  status: FormControl<string>;
  category: FormControl<string>;
}

interface EditorExportData {
  design: unknown;
  html: string;
}

interface ContactFormTemplatePayload {
  templateName: 'contact-form';
  title: string;
  fields: Array<{
    name: string;
    label: string;
    placeholder: string;
    type: 'text' | 'tel' | 'textarea';
  }>;
  html: string;
  design: unknown;
}

@Component({
  selector: 'app-unlayer-design',
  imports: [
    EmailEditorModule,
    Button,
    CustomInput,
    Dropdown,
    LucideDynamicIcon,
    ReactiveFormsModule,
    ConfirmDialog,
    CustomTextarea,
    DatePipe
  ],
  templateUrl: './unlayer-design.html',
  styleUrl: './unlayer-design.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnlayerDesign implements OnInit, OnDestroy {

  @Output() readonly contactFormInserted = new EventEmitter<ContactFormTemplatePayload>();

  @ViewChild(EmailEditorComponent)
  private emailEditor?: EmailEditorComponent;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  protected readonly postStore = inject(PostStore);
  protected readonly categoryStore = inject(CategoryStore);
  protected readonly authStore = inject(AuthStore);

  // UI State signals
  readonly leftPanelOpen = signal(true);
  readonly editorReady = signal(false);
  readonly submitted = signal(false);
  readonly isEditMode = signal(false);
  readonly submittingMode = signal<SaveMode | null>(null);
  private loadedPostId = signal<string | null>(null);

  // Confirm Dialog signals
  readonly showPublishConfirm = signal(false);
  readonly showRejectConfirm = signal(false);
  readonly showPrivateConfirm = signal(false);
  readonly rejectReason = signal('');
  readonly submittedReject = signal(false);

  // Cover Image State 
  readonly coverFile = signal<File | null>(null);
  readonly coverPreviewUrl = signal<string | null>(null);

  // Unlayer Editor Config 
  readonly editorOptions = {
    projectId: 286892,
    displayMode: 'web' as const,
    version: 'latest',
  };

  readonly regionOptions = [
    { label: 'Miền Bắc', value: 'Miền Bắc' },
    { label: 'Miền Trung', value: 'Miền Trung' },
    { label: 'Miền Nam', value: 'Miền Nam' },
  ];
  readonly statusOptions = PropertyStatus;


  readonly postForm = new FormGroup<PostForm>({
    title: new FormControl('', { nonNullable: true }),
    developer: new FormControl('', { nonNullable: true }),
    location: new FormControl('', { nonNullable: true }),
    region: new FormControl('', { nonNullable: true }),
    status: new FormControl(PropertyStatus.DRAFT, { nonNullable: true }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  });

  readonly rejectReasonControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly categories = this.categoryStore.categories;

  get f() {
    return this.postForm.controls;
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!postId);

    this.categoryStore.loadCategories();

    if (postId) {
      this.postStore.loadPostById(postId);
    } else {
      this.postStore.clearSelectedPost();
      const selectedCat = this.postStore.selectedCategory();
      if (selectedCat && selectedCat !== 'all') {
        this.postForm.patchValue({ category: selectedCat });
      }
    }
  }

  ngOnDestroy(): void {
    this.revokeCoverPreviewUrl();
  }

  // Effects
  private readonly syncPostToFormEffect = effect(() => {
    const post = this.postStore.selectedPost();
    const isReady = this.editorReady();

    if (!post?._id) return;

    // 1. Luôn cập nhật giá trị status mới nhất lên form để đồng bộ Badge hiển thị
    this.postForm.patchValue({
      status: post.status ?? PropertyStatus.DRAFT,
    }, { emitEvent: false });

    // 2. Nếu là cùng một bài viết đang sửa, dừng lại để tránh nạp lại Unlayer gây mất undo/redo stack
    if (this.loadedPostId() === post._id) {
      return;
    }

    this.loadedPostId.set(post._id);

    // 3. Chỉ điền các thông tin gốc và nạp thiết kế Unlayer một lần duy nhất khi chuyển bài viết
    this.postForm.patchValue({
      title: post.title ?? '',
      developer: post.developer ?? '',
      location: post.location ?? '',
      region: post.region ?? '',
      category: post.category?._id ?? '',
    }, { emitEvent: false });

    if (post.cover_picture?.url) {
      this.coverPreviewUrl.set(post.cover_picture.url);
    }

    if (isReady && post.jsonSource) {
      this.loadEditorDesign(post.jsonSource);
    }
  });

  private readonly syncLoadingToFormEffect = effect(() => {
    if (this.postStore.loading()) {
      this.postForm.disable({ emitEvent: false });
    } else {
      this.postForm.enable({ emitEvent: false });
    }
    this.f.status.disable({ emitEvent: false });
  });

  onEditorLoaded(): void {
    if (!this.emailEditor?.editor) return;
    this.editorReady.set(true);
  }

  // Luồng duyệt bài đăng
  submitForApproval(): void {
    const post = this.postStore.selectedPost();
    console.log('Submitting for approval, current status:', post?.status);
    if (!post?._id) return;

    this.postStore.updatePostStatus(post._id, 'Chờ duyệt' as any).subscribe({
      next: () => {
        this.toastService.success('Đã gửi yêu cầu duyệt bài đăng thành công');
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Lỗi khi gửi yêu cầu duyệt');
      }
    });
  }


  // Xác nhận xuất bản (Publish)
  openPublishConfirm(): void {
    this.showPublishConfirm.set(true);
  }

  closePublishConfirm(): void {
    this.showPublishConfirm.set(false);
  }

  confirmPublish(): void {
    const post = this.postStore.selectedPost();
    if (!post?._id) return;

    this.postStore.updatePostStatus(post._id, PropertyStatus.PUBLISHED).subscribe({
      next: () => {
        this.toastService.success('Đã xuất bản bài đăng thành công');
        this.closePublishConfirm();
        this.router.navigate(['/admin/post']);
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Lỗi khi xuất bản bài đăng');
      }
    });
  }

  // Xác nhận hủy duyệt (Reject) kèm lý do
  openRejectConfirm(): void {
    this.rejectReasonControl.reset('');
    this.submittedReject.set(false);
    this.showRejectConfirm.set(true);
  }

  closeRejectConfirm(): void {
    this.showRejectConfirm.set(false);
  }

  confirmReject(): void {
    this.submittedReject.set(true);

    if (this.rejectReasonControl.invalid) {
      this.rejectReasonControl.markAsTouched();
      return;
    }

    const reason = this.rejectReasonControl.value;

    const post = this.postStore.selectedPost();
    if (!post?._id) return;

    this.postStore.updatePostStatus(
      post._id,
      PropertyStatus.REJECTED,
      reason
    ).subscribe({
      next: (res) => {
        this.toastService.success(res.message || 'Đã từ chối duyệt và trả về Bản nháp');
        this.closeRejectConfirm();
        this.router.navigate(['/admin/post']);
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Lỗi khi từ chối duyệt bài đăng');
      }
    });
  }

  // Xác nhận Chuyển về riêng tư (Private)
  openPrivateConfirm(): void {
    this.showPrivateConfirm.set(true);
  }

  closePrivateConfirm(): void {
    this.showPrivateConfirm.set(false);
  }

  confirmMakePrivate(): void {
    const post = this.postStore.selectedPost();
    if (!post?._id) return;

    this.postStore.updatePostStatus(post._id, 'Riêng tư' as any).subscribe({
      next: () => {
        this.toastService.success('Đã chuyển bài đăng về trạng thái riêng tư');
        this.closePrivateConfirm();
        this.router.navigate(['/admin/post']);
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Lỗi khi chuyển bài đăng về riêng tư');
      }
    });
  }

  saveDesign(
    mode: SaveMode,
    status?: PropertyStatus
  ): void {
    this.submitted.set(true);

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const currentPost = this.postStore.selectedPost();
    const postId = this.isEditMode() ? currentPost?._id ?? null : null;

    // Không bắt buộc tải ảnh bìa
    // if (!this.isEditMode() && !this.coverFile()) {
    //   this.toastService.error('Vui lòng chọn ảnh bìa cho bài đăng');
    //   return;
    // }

    if (!this.emailEditor?.editor || !this.editorReady()) return;

    this.submittingMode.set(mode);

    this.emailEditor.editor.exportHtml((data: EditorExportData) => {
      const formData = this.buildFormData(data, status);

      this.postStore.savePost(postId, formData, { mode }).subscribe({
        next: (res) => {
          this.submittingMode.set(null);
          this.toastService.success(res.message || 'Lưu bài viết thành công');
          this.postForm.markAsPristine();

          if (mode === 'publish' || mode === 'update' || mode === 'create') {
            this.router.navigate(['/admin/post']);
          }
        },
        error: (err) => {
          this.submittingMode.set(null);
          this.toastService.error(
            err?.error?.message || 'Lỗi lưu bài viết'
          );
        }
      });
    });
  }

  exportDesignAsJson(): void {
    if (!this.emailEditor?.editor) return;

    this.emailEditor.editor.saveDesign((design: unknown) => {
      const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
      this.triggerFileDownload(blob, 'design.json');
    });
  }

  importDesignFromFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const design = JSON.parse(reader.result as string);
        this.emailEditor?.editor?.loadDesign(design);
      } catch {
        console.error('File JSON không hợp lệ');
      } finally {
        input.value = '';
      }
    };
    reader.readAsText(input.files[0]);
  }

  onCoverFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.setCoverFile(file);
    (event.target as HTMLInputElement).value = '';
  }

  onCoverFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file?.type.startsWith('image/')) {
      this.setCoverFile(file);
    }
  }

  toggleLeftPanel(): void {
    this.leftPanelOpen.update(open => !open);
  }

  insertContactFormTemplate(): void {
    if (!this.emailEditor?.editor || !this.editorReady()) return;

    const template = this.createContactFormTemplate();

    this.emailEditor.editor.saveDesign((currentDesign: unknown) => {
      try {
        const designObj = currentDesign as any;
        const templateObj = template.design as { body: { rows: unknown[] } };

        const newRow = structuredClone(templateObj.body.rows[0]);
        designObj.body.rows.push(newRow);

        this.emailEditor?.editor?.loadDesign(designObj);
        this.contactFormInserted.emit(template);

        this.toastService.success('Đã thêm biểu mẫu liên hệ vào thiết kế');
      } catch (error) {
        console.error(error);
        this.toastService.error('Không thể thêm biểu mẫu liên hệ');
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/post']);
  }

  private loadEditorDesign(jsonSource: string): void {
    try {
      const design = JSON.parse(jsonSource);
      this.emailEditor?.editor?.loadDesign(design);
    } catch {
      console.error('Lỗi parse JSON design');
    }
  }

  private buildFormData(
    editorData: EditorExportData,
    status?: PropertyStatus
  ): FormData {
    const formData = new FormData();
    const currentPost = this.postStore.selectedPost();

    if (this.isEditMode() && currentPost) {
      // Với bài viết đang chỉnh sửa, chỉ gửi những trường đã thay đổi so với dữ liệu gốc để tối ưu payload
      const controls = this.postForm.controls;

      if (controls.title.dirty && controls.title.value !== currentPost.title) {
        formData.append('title', controls.title.value);
      }
      if (controls.developer.dirty && controls.developer.value !== currentPost.developer) {
        formData.append('developer', controls.developer.value);
      }
      if (controls.location.dirty && controls.location.value !== currentPost.location) {
        formData.append('location', controls.location.value);
      }
      if (controls.region.dirty && controls.region.value !== currentPost.region) {
        formData.append('region', controls.region.value);
      }
      if (controls.category.dirty && controls.category.value !== currentPost.category?._id) {
        formData.append('category', controls.category.value);
      }


      const currentDesignJson = JSON.stringify(editorData.design);
      if (currentDesignJson !== currentPost.jsonSource) {
        formData.append('htmlSource', editorData.html);
        formData.append('jsonSource', currentDesignJson);
      }

      const cover = this.coverFile();
      if (cover) {
        formData.append('cover_picture', cover);
      }
    } else {
      // Với bài viết mới, gửi tất cả dữ liệu mà không cần so sánh
      const formValue = this.postForm.getRawValue();

      formData.append('title', formValue.title);
      formData.append('developer', formValue.developer);
      formData.append('location', formValue.location);
      formData.append('region', formValue.region);

      if (formValue.category) {
        formData.append('category', formValue.category);
      }
      if (status) {
        formData.append('status', status); // Gửi thêm status nếu muốn tạo và gửi duyệt luôn
      }

      formData.append('htmlSource', editorData.html);
      formData.append('jsonSource', JSON.stringify(editorData.design));

      const cover = this.coverFile();
      if (cover) {
        formData.append('cover_picture', cover);
      }
    }

    return formData;
  }

  private setCoverFile(file: File): void {
    this.revokeCoverPreviewUrl();
    this.coverFile.set(file);
    this.coverPreviewUrl.set(URL.createObjectURL(file));
    this.postForm.markAsDirty();
  }

  private revokeCoverPreviewUrl(): void {
    const url = this.coverPreviewUrl();
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  private triggerFileDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  private createContactFormTemplate(): ContactFormTemplatePayload {
    const html = contactFormTemplate;
    const design = contactFormTemplateDesign;

    return {
      templateName: 'contact-form',
      title: 'Biểu mẫu liên hệ',
      fields: [
        {
          name: 'name',
          label: 'Họ và tên',
          placeholder: 'Nhập họ và tên',
          type: 'text',
        },
        {
          name: 'phone',
          label: 'Số điện thoại',
          placeholder: 'Nhập số điện thoại',
          type: 'tel',
        },
        {
          name: 'message',
          label: 'Lời nhắn',
          placeholder: 'Nhập lời nhắn',
          type: 'textarea',
        },
      ],
      html,
      design,
    };
  }

  protected getStatusClass(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-600';
    return getPostStatusClass(status as any);
  }
}