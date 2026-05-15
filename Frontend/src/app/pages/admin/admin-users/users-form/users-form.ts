
import { Component, Input, Output, EventEmitter, OnInit, input, output, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from "../../../../shared/components/dropdown/dropdown";
import { CustomDatePicker } from '../../../../shared/components/custom-date-picker/custom-date-picker';
import { IUserAccount } from '../../../../types/type';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInput,
    Button,
    LucideDynamicIcon,
    Dropdown,
    CustomDatePicker
  ],
  templateUrl: './users-form.html',
  styleUrl: './users-form.css',
})
export class UsersForm {
  userModal = input<any>();
  mode = input<'view' | 'edit' | 'add'>('view');
  close = output<void>();
  save = output<any>();
  delete = output<void>();

  currentMode = signal<'view' | 'edit' | 'add'>('view');
  submitted: boolean = false;

  userForm = new FormGroup({
    fullName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
    role: new FormControl('staff', Validators.required),
    avatar: new FormControl(''),
    status: new FormControl('active', Validators.required),
    createdAt: new FormControl(new Date(), Validators.required),
  });

  roleOptions = [
    { label: 'Admin', value: 'admin', },
    { label: 'Staff', value: 'staff', },
  ];

  statusOptions = [
    { label: 'Nhân viên', value: 'active', },
    { label: 'Quản trị viên', value: 'inactive', },
  ];

  get f() {
    return this.userForm.controls;
  }

  constructor() {
    effect(() => {
      const mode = this.mode();
      const userModal = this.userModal();

      this.currentMode.set(mode);
      this.submitted = false;

      if (userModal) {
        this.userForm.patchValue(userModal);
      } else {
        this.userForm.reset({ role: 'staff', status: 'active', createdAt: new Date() });
      }

      if (mode === 'view') {
        this.userForm.disable();
      } else {
        this.userForm.enable();
      }
    });
  }

  onEdit() {
    this.currentMode.set('edit');
    this.userForm.enable();
  }

  onCancel() {
    // Logic: Nếu đang sửa một user cũ, bấm hủy quay về chế độ xem
    if (this.currentMode() === 'edit' && this.userModal()) {
      this.userForm.patchValue(this.userModal());
      this.userForm.disable();
      this.currentMode.set('view');
    } else {
      // Nếu đang add hoặc view mà bấm cancel thì đóng dialog
      this.close.emit();
    }
  }

  onSubmit() {
    this.submitted = true;
    this.userForm.markAllAsTouched();

    if (this.userForm.invalid) {
      console.log('Form invalid:', this.userForm.errors);

      return;
    }

    this.save.emit(this.userForm.value);
  }

  onDelete() {
    if (confirm('Bạn có chắc chắn muốn xóa tài khoản này?')) {
      this.delete.emit();
    }
  }

  onClose() {
    this.close.emit();
  }


}
