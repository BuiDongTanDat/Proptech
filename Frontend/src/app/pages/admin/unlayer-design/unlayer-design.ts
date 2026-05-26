import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  inject,
  signal,
  effect,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  EmailEditorComponent,
  EmailEditorModule,
} from 'angular-email-editor';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,

} from '@angular/forms';

import { Button } from '../../../shared/components/ui/button/button';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { PROPERTY_STATUS_OPTIONS } from '../../../core/constants/post.constant';
import { PostStore } from '../../../core/stores/post.store';
import { PropertyStatus } from '../../../core/enum/enums';

interface IPostForm {
  title: FormControl<string>;
  developer: FormControl<string>;
  location: FormControl<string>;
  region: FormControl<string>;
  status: FormControl<string>;
  cover_picture?: FormControl<File | null>;
}

@Component({
  selector: 'app-unlayer-design',
  standalone: true,
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

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  protected readonly store = inject(PostStore);

  // SIGNALS
  leftOpen = signal(true);
  editorReady = signal(false);
  submitted = signal(false);
  isEditMode = signal(false);
  coverFile = signal<File | null>(null);
  coverPreview = signal<string | null>(null);

  selectedPost: any = null;

  // EDITOR CONFIG
  editorOptions = {
    projectId: 123456, //286892
    displayMode: 'web' as const,
    version: 'latest',
  };

  // DROPDOWN DATA
  regionOptions = [
    { label: 'Miền Bắc', value: 'Miền Bắc' },
    { label: 'Miền Trung', value: 'Miền Trung' },
    { label: 'Miền Nam', value: 'Miền Nam' },
  ];

  statusOptions = PROPERTY_STATUS_OPTIONS;

  // FORM
  postForm = new FormGroup<IPostForm>({
    title: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    developer: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    location: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    region: new FormControl('', {
      nonNullable: true,
      validators: Validators.required,
    }),
    status: new FormControl(PropertyStatus.DRAFT, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });

  get f() {
    return this.postForm.controls;
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.paramMap.get('id');
    this.isEditMode.set(!!postId);

    if (postId) {
      // Gọi store để load dữ liệu
      this.store.loadPostById(postId);
    } else {
      // Nếu là tạo mới, clear dữ liệu cũ trong store
      this.store.clearSelectedPost();
    }
  }

  // EFFECT xử lý phản ứng khi dữ liệu Store thay đổi hoặc Editor sẵn sàng
  private postEffect = effect(() => {
    const post = this.store.selectedPost();
    const isReady = this.editorReady();

    if (!post) return;

    // 1. Cập nhật Form
    this.postForm.patchValue({
      title: post.title ?? '',
      developer: post.developer ?? '',
      location: post.location ?? '',
      region: post.region ?? '',
      status: post.status ?? 'Bản nháp',
    });

    // 2. Cập nhật ảnh preview
    if (post.cover_picture?.url) {
      this.coverPreview.set(post.cover_picture.url);
    }

    // 3. Nếu editor đã sẵn sàng và có dữ liệu thiết kế, load nó vào editor
    if (isReady && post.jsonSource) {
      this.loadPostDesign(post.jsonSource);
    }
  });

  private loadPostDesign(jsonSource: any): void {
    try {
      const design = JSON.parse(jsonSource);
      this.emailEditor?.editor?.loadDesign(design);
    } catch (e) {
      console.error('Lỗi parse JSON thiết kế:', e);
    }
  }


  toggleLeft(): void {
    this.leftOpen.update(v => !v);
  }

  editorLoaded(): void {
    // Đợi editor sẵn sàng rồi mới load design để tránh lỗi gọi API 
    // quá sớm khi editor chưa khởi tạo xong
    if (!this.emailEditor?.editor) return;

    this.editorReady.set(true);


    if (this.selectedPost) {
      this.loadPostDesign(this.selectedPost);
    }
  }

  saveDesign(): void {
    this.submitted.set(true);

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    // tạo mới bắt buộc có ảnh
    if (!this.isEditMode() && !this.coverFile()) {
      alert('Vui lòng chọn ảnh bìa');
      return;
    }

    if (!this.emailEditor?.editor || !this.editorReady()) return;

    this.emailEditor.editor.exportHtml(
      (data: { design: any; html: string }) => {
        const formValue = this.postForm.getRawValue();
        const formData = new FormData();

        Object.entries(formValue).forEach(([key, value]) => {
          formData.append(key, value as string);
        });

        formData.append('htmlSource', data.html);
        formData.append('jsonSource', JSON.stringify(data.design));

        // chỉ append nếu user chọn file mới
        const file = this.coverFile();
        if (file) {
          formData.append('cover_picture', file);
        }

        const currentPost = this.store.selectedPost();

        if (this.isEditMode() && currentPost?._id) {
          this.store.updatePost(currentPost._id, formData);
        } else {
          this.store.addPost(formData);
        }
      }
    );
  }

  // Hàm xuất JSON thiết kế
  exportJson(): void {
    if (!this.emailEditor?.editor) return;

    this.emailEditor.editor.saveDesign((design: unknown) => {
      const blob = new Blob(
        [JSON.stringify(design, null, 2)],
        { type: 'application/json' }
      );

      this.downloadFile(blob, 'design.json');
    });
  }

  loadDesign(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const design = JSON.parse(reader.result as string);

        if (!this.emailEditor?.editor) return;

        this.emailEditor.editor.loadDesign(design);
      } catch (error) {
        console.error('JSON không hợp lệ', error);
      } finally {
        input.value = '';
      }
    };

    reader.readAsText(file);
  }

  savePostInfo(): void {
    this.submitted.set(true);

    if (this.postForm.invalid) {
      this.postForm.markAllAsTouched();
      return;
    }

    console.log('POST INFO:', this.postForm.getRawValue());
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  goBack(): void {
    this.router.navigate(['/admin/post']);
  }

  // Xử lý Ảnh nền
  onCoverSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    // Giải phóng URL cũ nếu có để tránh tràn bộ nhớ
    if (this.coverPreview()?.startsWith('blob:')) {
      URL.revokeObjectURL(this.coverPreview()!);
    }

    const newUrl = URL.createObjectURL(file);
    this.coverFile.set(file);
    this.coverPreview.set(newUrl);
    input.value = '';
  }

  onCoverDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    this.coverFile.set(file);
    this.coverPreview.set(URL.createObjectURL(file));
  }

  ngOnDestroy(): void {
    // Cleanup ảnh preview khi thoát component
    if (this.coverPreview()?.startsWith('blob:')) {
      URL.revokeObjectURL(this.coverPreview()!);
    }
  }

  private loadingEffect = effect(() => {
    const isLoading = this.store.loading();

    if (isLoading) {
      this.postForm.disable({ emitEvent: false });
    } else {
      this.postForm.enable({ emitEvent: false });
    }
  });

}