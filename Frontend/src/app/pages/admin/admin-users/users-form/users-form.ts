
import { Component, input, output, signal, effect, inject } from '@angular/core';
import { UserStore } from '../../../../core/stores/users.store';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { Dropdown } from "../../../../shared/components/dropdown/dropdown";
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS } from '../../../../core/constants/user.constants';

@Component({
  selector: 'app-users-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustomInput,
    Button,
    LucideDynamicIcon,
    Dropdown
  ],
  templateUrl: './users-form.html',
  styleUrl: './users-form.css',
})
export class UsersForm {
  store = inject(UserStore);
  readonly roleOptions = USER_ROLE_OPTIONS;
  readonly statusOptions = USER_STATUS_OPTIONS;


  userModal = input<any>();
  mode = input<'view' | 'edit' | 'add'>('view');
  close = output<void>();
  save = output<any>();
  delete = output<void>();

  currentMode = signal<'view' | 'edit' | 'add'>('view');
  submitted: boolean = false;

  userForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    role: new FormControl('Nhân viên', Validators.required),
    status: new FormControl('Chờ xác thực', Validators.required),
  });


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
        this.userForm.reset({ role: 'Nhân viên', status: 'Ngừng hoạt động' });
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

  onResendPassword() {
    const user = this.userModal();
    if (!user?._id) return;

    // Gọi action từ Store thay vì gọi service trực tiếp
    this.store.resendVerification(user._id);

    console.log('Resend password for:', user.email);

  }


}
