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
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmailEditorComponent, EmailEditorModule } from 'angular-email-editor';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { PostStore } from '../../../../core/stores/post.store';
import { PropertyStatus } from '../../../../core/enum/enums';
import { ToastService } from '../../../../core/services/toast.service';
import { CategoryStore } from '../../../../core/stores/category.store';
import { contactFormTemplate, contactFormTemplateDesign, getPostStatusClass } from '../../../../shared/utils/helper';
import { AuthStore } from '../../../../core/stores/auth.store';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { CustomTextarea } from '../../../../shared/components/ui/custom-textarea/custom-textarea';
import { DatePipe } from '@angular/common';
import {
  POST_PAGE_CONFIG,
  PostType,
  isPostType,
} from '../../../../core/config/post.config';
import { CustomDatePicker } from "../../../../shared/components/custom-date-picker/custom-date-picker";

type PostAction = 'create-draft' | 'create-pending' | 'publish' | 'update';

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
    DatePipe,
    CustomDatePicker
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
  readonly submittingMode = signal<PostAction | null>(null);
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
    projectId: 123456,
    displayMode: 'web' as const,
    version: 'latest',
  };

  readonly statusOptions = PropertyStatus;
  readonly postType = signal<PostType>('project');
  readonly currentConfig = computed(() => POST_PAGE_CONFIG[this.postType()]);

  // Lấy các cấu hình trường không chứa hình ảnh
  readonly formFields = computed(() =>
    this.currentConfig().fields.filter((field) => field.type !== 'image')
  );

  // Tự động phân giải và nạp danh mục cho trường có key là 'category'
  readonly resolvedFormFields = computed(() => {
    const fields = this.formFields();
    const cats = this.categoryStore.categories();
    return fields.map((field) => {
      if (field.key === 'category') {
        return {
          ...field,
          options: cats.map((c) => ({ label: c.name, value: c._id ?? '' })),
        };
      }
      return field;
    });
  });

  readonly imageFields = computed(() =>
    this.currentConfig().fields.filter((field) => field.type === 'image')
  );

  // Khởi tạo form cơ bản với duy nhất trường trạng thái ban đầu
  readonly postForm = new FormGroup<Record<string, FormControl<any>>>({
    status: new FormControl(PropertyStatus.DRAFT, { nonNullable: true }),
  });

  readonly rejectReasonControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });

  get f() {
    return this.postForm.controls;
  }

  ngOnInit(): void {
    const type = this.route.snapshot.paramMap.get('type');

    if (isPostType(type)) {
      this.postType.set(type);
    }

    this.initDynamicFields();

    const postId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!postId);

    this.categoryStore.loadCategories();

    if (postId) {
      this.postStore.loadPostById(postId);
    } else {
      this.postStore.clearSelectedPost();

      const selectedCat = this.postStore.selectedCategory();
      if (selectedCat && selectedCat !== 'all' && this.postForm.contains('category')) {
        this.postForm.patchValue({ category: selectedCat });
      }
    }
  }

  ngOnDestroy(): void {
    this.revokeCoverPreviewUrl();
  }

  // Khởi tạo các trường động theo cấu hình loại bài viết hiện tại
  private initDynamicFields(): void {
    // Xóa bớt các điều khiển không phải 'status' để tránh dư thừa khi đổi loại bài đăng
    const keys = Object.keys(this.postForm.controls);
    for (const key of keys) {
      if (key !== 'status') {
        // this.postForm.removeControl(key);
      }
    }

    for (const field of this.formFields()) {
      this.postForm.addControl(
        field.key,
        new FormControl('', {
          nonNullable: true,
          validators: field.required ? [Validators.required] : [],
        })
      );
    }
  }

  protected getControl(key: string): FormControl<any> {
    return this.postForm.controls[key] as FormControl<any>;
  }

  // Đồng bộ hóa dữ liệu từ PostStore vào FormGroup dựa trên cấu hình động
  private readonly syncPostToFormEffect = effect(() => {
    const post = this.postStore.selectedPost();
    const isReady = this.editorReady();

    if (!post?._id) return;

    const isNewPost = this.loadedPostId() !== post._id;

    const patchValue: Record<string, any> = {
      status: post.status ?? PropertyStatus.DRAFT,
    };

    // Chỉ gán giá trị nếu trường đó tồn tại trong cấu hình form hiện hành
    for (const field of this.formFields()) {
      if (field.key === 'category') {
        patchValue['category'] = post.category?._id ?? '';
      } else {
        patchValue[field.key] = (post as any)[field.key] ?? '';
      }
    }

    this.postForm.patchValue(patchValue, { emitEvent: false });

    if (!isNewPost) {
      return;
    }

    this.loadedPostId.set(post._id);

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
    //luôn giữ trường 'status' ở trạng thái disabled để tránh người dùng thay đổi trực tiếp
    this.postForm.controls['status']?.disable({ emitEvent: false });
  });

  onEditorLoaded(): void {
    const editorInstance = this.emailEditor;
    if (!editorInstance || !editorInstance.editor) return;

    editorInstance.editor.addEventListener('design:loaded', () => {
      editorInstance.editor.setBodyValues({
        contentWidth: '100%'
      });
    });

    this.editorReady.set(true);

    const post = this.postStore.selectedPost();
    if (post?.jsonSource) {
      this.loadEditorDesign(post.jsonSource);
    }
  }

  submitForApproval(): void {
    const post = this.postStore.selectedPost();
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

  saveDesign(action: PostAction): void {
    this.submitted.set(true);

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    const post = this.postStore.selectedPost();
    const postId = this.isEditMode() ? post?._id ?? null : null;

    if (!this.emailEditor?.editor || !this.editorReady()) return;

    this.submittingMode.set(action);

    this.emailEditor.editor.exportHtml((data: EditorExportData) => {
      const status = this.resolveStatus(action);
      const formData = this.buildFormData(data, status);

      this.postStore.savePost(postId, formData).subscribe({
        next: (res) => {
          this.submittingMode.set(null);
          this.toastService.success(res?.message || 'Lưu thành công');
          this.router.navigate(['/admin/post']);
        },
        error: (err) => {
          this.submittingMode.set(null);
          this.toastService.error(err?.error?.message || 'Lỗi');
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
        { name: 'name', label: 'Họ và tên', placeholder: 'Nhập họ và tên', type: 'text' },
        { name: 'phone', label: 'Số điện thoại', placeholder: 'Nhập số điện thoại', type: 'tel' },
        { name: 'message', label: 'Lời nhắn', placeholder: 'Nhập lời nhắn', type: 'textarea' },
      ],
      html,
      design,
    };
  }

  protected getStatusClass(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-600';
    return getPostStatusClass(status as any);
  }

  private buildFormData(
    editorData: EditorExportData,
    status?: PropertyStatus
  ): FormData {
    const formData = new FormData();
    const currentPost = this.postStore.selectedPost();
    const formValue = this.postForm.getRawValue();

    // formData.append('type', this.postType());

    // Nếu là edit, chỉ thêm những trường đã thay đổi vào FormData để tránh ghi đè dữ liệu không cần thiết
    if (this.isEditMode() && currentPost) {
      for (const field of this.formFields()) {
        const control = this.postForm.controls[field.key];
        const newValue = control?.value ?? '';
        let oldValue = '';

        if (field.key === 'category') {
          oldValue = currentPost.category?._id ?? '';
        } else {
          oldValue = (currentPost as any)[field.key] ?? '';
        }

        if (control?.dirty && newValue !== oldValue) {
          formData.append(field.key, newValue);
        }
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
      for (const field of this.formFields()) {
        const value = formValue[field.key];
        if (value !== undefined && value !== null && value !== '') {
          formData.append(field.key, value);
        }
      }

      if (status) {
        formData.append('status', status);
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

  // Hàm xử lý trạng thái bài đăng dựa trên hành động người dùng
  private resolveStatus(action: PostAction): PropertyStatus {
    switch (action) {
      case 'create-draft':
        return PropertyStatus.DRAFT;
      case 'create-pending':
        return PropertyStatus.PENDING_APPROVAL;
      case 'publish':
        return PropertyStatus.PUBLISHED;
      case 'update':
        return this.postStore.selectedPost()?.status ?? PropertyStatus.DRAFT;
    }
  }
}