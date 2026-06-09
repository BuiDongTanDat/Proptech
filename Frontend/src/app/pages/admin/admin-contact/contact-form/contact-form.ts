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
import { CONTACT_STATUS_OPTIONS, CONTACT_STATUS_UPDATE_OPTIONS } from '../../../../core/constants/contact.constant';
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

  readonly statusOptions = CONTACT_STATUS_UPDATE_OPTIONS;

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

  private fillForm(contact: any) {
    this.contactForm.patchValue({
      name: contact?.name || '',
      phone: contact?.phone || '',
      message: contact?.message || '',
      status: contact?.status || 'Mới',
      resolvedBy: contact?.resolvedBy?._id || '',
      post: contact?.post?._id || '', //Khi lưu thì thông tin post là object, nên phải trích ra trường _id thì dropdown mới hiện tương ứng được
    });
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
        this.fillForm(contactModal);
      }
      else {
        this.contactForm.reset({ status: 'Mới' });
      }

      if (mode === 'view') {
        this.contactForm.disable();
      }

      if (mode === 'add') {
        this.contactForm.enable();
      }

      if (mode === 'edit') {
        this.contactForm.disable();

        // Chỉ cho sửa status
        this.f.status.enable();
      }
    });
  }

  onEdit() {
    this.currentMode.set('edit');
    this.contactForm.disable();
    this.f.status.enable();
  }

  onCancel() {
    const contact = this.contactModal();

    if (this.currentMode() === 'edit' && contact) {
      this.fillForm(contact);
      this.contactForm.disable();
      this.currentMode.set('view');
    } else {
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;

    const mode = this.currentMode();
    const contact = this.contactModal();

    // UPDATE STATUS
    if (mode === 'edit' && contact?._id) {

      const status = this.f.status.value;

      this.store.updateContactStatus(
        contact._id,
        status as any
      ).subscribe({
        next: () => {
          this.store.loadContacts();

          this.close.emit();
        }
      });

      return;
    }

    // ADD CONTACT
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      return;
    }

    const formValue = this.contactForm.getRawValue();

    this.save.emit({
      name: formValue.name,
      phone: formValue.phone,
      message: formValue.message,
      post: formValue.post,
    });
  }

  onDelete() {
    this.delete.emit();
  }

  onClose() {
    this.close.emit();
  }
}