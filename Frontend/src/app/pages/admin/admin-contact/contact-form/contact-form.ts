import { Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';

@Component({
  selector: 'app-contact-form',
  imports: [LucideDynamicIcon, Button, CustomInput, ReactiveFormsModule, Dropdown],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactForm {

  contact = input<any>();
  mode = input<'view' | 'edit' | 'add'>('view');
  close = output<void>();
  save = output<{
    fullName: string | null;
    email: string | null;
    phone: string | null;
    message: string | null;
    status: string | null;
  }>();
  delete = output<void>();

  currentMode = signal<'view' | 'edit' | 'add'>('view');
  submitted: boolean = false;

  contactForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]), // Thêm pattern cho phone
    message: new FormControl('', Validators.required),
    status: new FormControl('new', Validators.required),
  });

  statusOptions = [
    {
      label: 'Mới',
      value: 'new',
    },
    {
      label: 'Đã liên hệ',
      value: 'contacted',
    },
    {
      label: 'Đã đóng',
      value: 'closed',
    },
  ];

  get f() {
    return this.contactForm.controls;
  }

  constructor() {
    effect(() => {
      const mode = this.mode();
      const contact = this.contact();


      this.currentMode.set(mode);
      this.submitted = false; // Reset trạng thái khi đổi mode

      if (contact) {
        this.contactForm.patchValue(contact);
      } else {
        this.contactForm.reset({ status: 'new' });
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
    // Nếu đang chỉnh sửa (edit) một liên hệ đã có dữ liệu (contact)
    // thì quay lại chế độ xem (view).
    if (this.currentMode() === 'edit' && this.contact()) {
      this.contactForm.patchValue(this.contact());
      this.contactForm.disable();
      this.currentMode.set('view');
    } else {
      // Nếu đang ở mode 'add' hoặc mode 'view' mà bấm hủy/đóng thì thoát luôn
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;
    // Mark all as touched để hiện lỗi nếu user chưa bấm vào input nào
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      console.log('Form invalid:', this.contactForm.errors);
      return;
    }

    this.save.emit(this.contactForm.getRawValue());
  }

  onDelete() {
    this.delete.emit();
  }

  // Gọi để tắt form luôn không cần quan tâm đang ở mode nào
  onClose() {
    this.close.emit();
  }

}
