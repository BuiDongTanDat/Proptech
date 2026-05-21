import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-forgot-page',
  imports: [
    ReactiveFormsModule,
    LucideDynamicIcon,
    CustomInput,
    Button,
],
  templateUrl: './forgot-page.html',
  styleUrl: './forgot-page.css',
})
export class ForgotPage {
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  submitted = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    // Xử lý gửi email tại đây
    console.log(this.forgotForm.value);

    const email = this.forgotForm.value.email;

    if (!email) return;

    this.authService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.toastService.success('Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn.');
        this.clearInput();
      },
      error: (error) => {
        this.toastService.error(error?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  }

  clearInput(){
    this.forgotForm.reset();
    this.submitted = false;
  }

  onBackToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
