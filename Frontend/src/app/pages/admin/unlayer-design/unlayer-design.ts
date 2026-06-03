import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
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


// Types
type SaveMode = 'draft' | 'publish' | 'update' | 'create';

import { CategoryStore } from '../../../core/stores/category.store';

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

@Component({
  selector: 'app-unlayer-design',
  imports: [
    EmailEditorModule,
    Button,
    CustomInput,
    Dropdown,
    LucideDynamicIcon,
    ReactiveFormsModule,
  ],
  templateUrl: './unlayer-design.html',
  styleUrl: './unlayer-design.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnlayerDesign implements OnInit, OnDestroy {

  @ViewChild(EmailEditorComponent)
  private emailEditor?: EmailEditorComponent;

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toastService = inject(ToastService);
  protected readonly store = inject(PostStore);
  protected readonly categoryStore = inject(CategoryStore);

  // UI State signals
  readonly leftPanelOpen = signal(true);
  readonly editorReady = signal(false);
  readonly submitted = signal(false);
  readonly isEditMode = signal(false);
  readonly submittingMode = signal<SaveMode | null>(null);

  //  Cover Image State 
  readonly coverFile = signal<File | null>(null);
  readonly coverPreviewUrl = signal<string | null>(null);

  // Unlayer Editor Config 
  readonly editorOptions = {
    projectId: 286892,
    displayMode: 'web' as const,
    version: 'latest',
  };

  //Dropdown Options 
  readonly regionOptions = [
    { label: 'Miền Bắc', value: 'Miền Bắc' },
    { label: 'Miền Trung', value: 'Miền Trung' },
    { label: 'Miền Nam', value: 'Miền Nam' },
  ];
  readonly statusOptions = PROPERTY_STATUS_OPTIONS;

  //  Form
  readonly postForm = new FormGroup<PostForm>({
    title: new FormControl('', { nonNullable: true, validators: Validators.required }),
    developer: new FormControl('', { nonNullable: true, validators: Validators.required }),
    location: new FormControl('', { nonNullable: true, validators: Validators.required }),
    region: new FormControl('', { nonNullable: true, validators: Validators.required }),
    status: new FormControl(PropertyStatus.DRAFT, { nonNullable: true, validators: Validators.required }),
    category: new FormControl('', { nonNullable: true, validators: Validators.required }),
  });

  // Expose categories for dropdown
  readonly categories = this.categoryStore.categories;

  get f() {
    return this.postForm.controls;
  }


  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!postId);

    // Luôn load categories để có dữ liệu cho dropdown
    this.categoryStore.loadCategories();

    // Nếu có postId trong URL, load dữ liệu post đó vào form và editor
    if (postId) {
      this.store.loadPostById(postId);
    } else {
      this.store.clearSelectedPost();
      // Gán category mặc định khi thêm mới
      const selectedCat = this.store.selectedCategory();
      if (selectedCat && selectedCat !== 'all') {
        this.postForm.patchValue({ category: selectedCat });
      }
    }
  }

  ngOnDestroy(): void {
    // Giải phóng blob URL khi component bị hủy để tránh memory leak
    this.revokeCoverPreviewUrl();
  }


  // Effects
  /*
   Khi dữ liệu post từ store thay đổi (hoặc editor vừa sẵn sàng),
    tự động điền form, cập nhật ảnh bìa, và load design vào editor.
   */
  private readonly syncPostToFormEffect = effect(() => {
    const post = this.store.selectedPost();
    const isReady = this.editorReady();

    if (!post) return;

    this.postForm.patchValue({
      title: post.title ?? '',
      developer: post.developer ?? '',
      location: post.location ?? '',
      region: post.region ?? '',
      status: post.status ?? PropertyStatus.DRAFT,
      category: post.category?._id ?? '',
    });

    if (post.cover_picture?.url) {
      this.coverPreviewUrl.set(post.cover_picture.url);
    }

    if (isReady && post.jsonSource) {
      this.loadEditorDesign(post.jsonSource);
    }
  });

  /*
   Disable/enable toàn bộ form theo trạng thái loading của store,
   tránh người dùng submit khi đang gọi API.
   */
  private readonly syncLoadingToFormEffect = effect(() => {
    if (this.store.loading()) {
      this.postForm.disable({ emitEvent: false });
    } else {
      this.postForm.enable({ emitEvent: false });
    }

    //status luôn readonly
    this.f.status.disable({ emitEvent: false });
  });

  // 
  // Editor Events
  /*
   Callback khi Unlayer editor đã khởi tạo xong.
   Đánh dấu editor sẵn sàng để effect có thể load design.
   */
  onEditorLoaded(): void {
    if (!this.emailEditor?.editor) return;
    this.editorReady.set(true);
  }


  // Save / Submit
  /*
   Xuất HTML từ editor và gọi store để lưu (tạo mới hoặc cập nhật).
   Validate form và ảnh bìa trước khi gửi.
   */
  saveDesign(mode: SaveMode): void {
    this.submitted.set(true);

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    // Lấy postID nếu đang ở chế độ edit, null nếu đang tạo mới
    const currentPost = this.store.selectedPost();
    const postId = this.isEditMode() ? currentPost?._id ?? null : null;


    // tạo mới bắt buộc phải có ảnh
    if (!this.isEditMode() && !this.coverFile()) {
      this.toastService.error('Vui lòng chọn ảnh bìa cho bài đăng');
      return;
    }

    if (!this.emailEditor?.editor || !this.editorReady()) return;

    // chỉ loading cho nút đang bấm
    this.submittingMode.set(mode);

    this.emailEditor.editor.exportHtml((data: EditorExportData) => {
      const formData = this.buildFormData(data);

      this.store.savePost(postId, formData, { mode }).subscribe({
        next: (res) => {
          // reset spinner
          this.submittingMode.set(null);

          const messageMap = {
            draft: 'Đã lưu nháp',
            publish: 'Đăng bài thành công',
            update: 'Đã lưu thay đổi',
            create: 'Đã tạo mới bài đăng',
          };

          this.toastService.success(messageMap[mode]);

          // chỉ publish/update/create mới chuyển trang
          if (mode === 'publish' || mode === 'update' || mode === 'create') {
            this.router.navigate(['/admin/post']);
          }
        },

        error: (err) => {
          // reset spinner khi lỗi
          this.submittingMode.set(null);

          this.toastService.error(
            err?.message || 'Lỗi lưu bài viết'
          );
        }
      });
    });
  }

  // Design Import / Export

  //Xuất design hiện tại của editor ra file JSON để backup. 
  exportDesignAsJson(): void {
    if (!this.emailEditor?.editor) return;

    this.emailEditor.editor.saveDesign((design: unknown) => {
      const blob = new Blob([JSON.stringify(design, null, 2)], { type: 'application/json' });
      this.triggerFileDownload(blob, 'design.json');
    });
  }

  // Nhập design từ file JSON và load vào editor. */
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
        input.value = ''; // Reset input để có thể chọn lại cùng file
      }
    };

    reader.readAsText(input.files[0]);
  }


  // Cover Image

  // Xử lý khi người dùng chọn ảnh bìa qua input file. */
  onCoverFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.setCoverFile(file);
    (event.target as HTMLInputElement).value = '';
  }

  // Xử lý khi người dùng kéo thả ảnh bìa.
  onCoverFileDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file?.type.startsWith('image/')) {
      this.setCoverFile(file);
    }
  }


  // Navigation / Panel
  toggleLeftPanel(): void {
    this.leftPanelOpen.update(open => !open);
  }
  goBack(): void {
    this.router.navigate(['/admin/post']);
  }


  // Helpers

  // Parse chuỗi JSON design và load vào Unlayer editor.
  private loadEditorDesign(jsonSource: string): void {
    try {
      const design = JSON.parse(jsonSource);
      this.emailEditor?.editor?.loadDesign(design);
    } catch {
      console.error('Lỗi parse JSON design');
    }
  }

  /*
   Tạo FormData từ giá trị form và dữ liệu export của editor.
   Chỉ đính kèm ảnh bìa nếu người dùng đã chọn file mới.
  */
  private buildFormData(editorData: EditorExportData): FormData {
    const formData = new FormData();
    const formValue = this.postForm.getRawValue();

    // Gửi các trường cơ bản
    Object.entries(formValue).forEach(([key, value]) => {
      // Không gửi category ở đây, xử lý riêng bên dưới
      if (key !== 'category') {
        formData.append(key, value as string);
      }
    });

    // Gửi categoryId
    if (formValue.category) {
      formData.append('category', formValue.category);
    }

    formData.append('htmlSource', editorData.html);
    formData.append('jsonSource', JSON.stringify(editorData.design));

    const cover = this.coverFile();
    if (cover) {
      formData.append('cover_picture', cover);
    }

    return formData;
  }

  // Cập nhật signal coverFile và tạo blob URL preview mới. */
  private setCoverFile(file: File): void {
    this.revokeCoverPreviewUrl(); // Giải phóng URL cũ trước khi tạo mới
    this.coverFile.set(file);
    this.coverPreviewUrl.set(URL.createObjectURL(file));
  }

  // Giải phóng blob URL cũ để tránh memory leak. 
  private revokeCoverPreviewUrl(): void {
    const url = this.coverPreviewUrl();
    if (url?.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  // Tạo thẻ <a> ẩn để trigger download file về máy. 
  private triggerFileDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
  }
}