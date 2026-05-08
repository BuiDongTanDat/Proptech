import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-reset-password',
  imports: [LucideDynamicIcon, FormsModule, ReactiveFormsModule, CustomInput, Button],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  resetForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  submitted = false;
  showNewPassword = false;
  showConfirmPassword = false;

  get f() {
    return this.resetForm.controls;
  }

  get passwordMismatch(): boolean {
    return this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword;
  }

  onSubmit() {
    this.submitted = true;
    if (this.resetForm.invalid) return;
    if (this.passwordMismatch) return;

    console.log('Mật khẩu mới:', this.resetForm.value.newPassword);
    // TODO: gọi API reset password
  }
}