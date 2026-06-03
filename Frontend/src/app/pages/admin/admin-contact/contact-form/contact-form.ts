import { Component, input, output, signal, effect, inject } from '@angular/core';
import { ContactsStore } from '../../../../core/stores/contacts.store';
import { UserStore } from '../../../../core/stores/users.store';
import { PostStore } from '../../../../core/stores/post.store';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { CONTACT_STATUS_OPTIONS } from '../../../../core/constants/contact.constant';
import { CustomTextarea } from "../../../../shared/components/ui/custom-textarea/custom-textarea";

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInput,
    Button,
    LucideDynamicIcon,
    Dropdown,
    CustomTextarea
  ],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {
  store = inject(ContactsStore);
  userStore = inject(UserStore);
  postStore = inject(PostStore);

  readonly statusOptions = CONTACT_STATUS_OPTIONS;

  // Dropdown options for users and posts
  //userOptions = signal<{ label: string; value: string }[]>([]);
  postOptions = signal<{ label: string; value: string }[]>([]);

  contactModal = input<any>();
  mode = input<'view' | 'edit' | 'add'>('view');
  close = output<void>();
  save = output<any>();
  delete = output<void>();

  currentMode = signal<'view' | 'edit' | 'add'>('view');
  submitted: boolean = false;

  contactForm = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    status: new FormControl('Mới', Validators.required),
    resolvedBy: new FormControl(''),
    post: new FormControl('', Validators.required),
  });

  get f() {
    return this.contactForm.controls;
  }

  constructor() {
    // Tải danh sách nhân viên và bài đăng để hiển thị trong dropdown
    this.userStore.loadUsers();
    this.postStore.loadAllRealEstatePosts();

    effect(() => {
      // Hiển thị toàn bộ danh sách dự án (posts) trong dropdown
      const posts = this.postStore.allRealEstatePosts(); // lấy toàn bộ danh sách, không filter
      this.postOptions.set(
        posts.map(p => ({
          label: p.title,
          value: p._id || '',
          location: p.location,
          image: p.cover_picture.url || 'bg_card.png',
          developer: p.developer,
          post: p._id || ''
        }))
      );

    });

    effect(() => {
      const mode = this.mode();
      const contactModal = this.contactModal();
      this.currentMode.set(mode);
      this.submitted = false;

      if (contactModal) {
        // Patch value for edit/view
        this.contactForm.patchValue({
          name: contactModal.name || '',
          phone: contactModal.phone || '',
          message: contactModal.message || '',
          status: contactModal.status || 'Mới',
          resolvedBy: contactModal.resolvedBy?._id || '',
          post: contactModal.post?._id || '',
        });
      } else {
        this.contactForm.reset({ status: 'Mới' });
      }

      if (mode === 'view') {
        this.contactForm.disable();
      } else {
        this.contactForm.enable();
      }
    });
  }

  onEdit() {
    this.currentMode.set('edit');
    this.contactForm.enable();
  }

  onCancel() {
    if (this.currentMode() === 'edit' && this.contactModal()) {
      this.contactForm.patchValue(this.contactModal());
      this.contactForm.disable();
      this.currentMode.set('view');
    } else {
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      console.log('Form invalid:', this.contactForm.errors);
      return;
    }
    // Chuẩn hóa dữ liệu gửi đi
    const formValue = this.contactForm.value;
    const data = {
      name: formValue.name,
      phone: formValue.phone,
      message: formValue.message,
      status: formValue.status,
      post: formValue.post ? formValue.post : '', 
    };
    console.log('Submitting contact data:', data);
    this.save.emit(data);
  }

  onDelete() {
    this.delete.emit();
  }

  onClose() {
    this.close.emit();
  }
}