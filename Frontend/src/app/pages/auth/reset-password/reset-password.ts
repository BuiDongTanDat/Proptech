import { Component, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';
import { Toast } from '../../../shared/components/toast/toast';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [LucideDynamicIcon,
    FormsModule, ReactiveFormsModule, CustomInput, Button, Toast],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {

  resetForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  token: string | null = null;

  submitted = false;
  loading = signal<boolean>(false);
  showNewPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || null;
    });
  }

  ngAfterViewInit() {
    if (!this.token) {
      this.toastService.error('Thiếu token xác thực!');
    }
  }

  get f() {
    return this.resetForm.controls;
  }

  get passwordMismatch(): boolean {
    return this.resetForm.value.newPassword !== this.resetForm.value.confirmPassword;
  }

  onSubmit() {
    this.submitted = true;

    if (this.resetForm.invalid) {
      return;
    }

    if (this.passwordMismatch) {
      return;
    }

    if (!this.token) {
      this.toastService.error('Thiếu token xác thực!');
      return;
    }

    const password = this.resetForm.value.newPassword;

    if (!password) {
      return;
    }

    //Chỉ bật loading khi đã kiểm tra đủ điều kiện để gửi request, tránh trường hợp bấm submit nhiều lần khi form chưa valid
    this.loading.set(true);

    this.authService.resetPassword(this.token, password).subscribe({
      next: (res) => {
        this.toastService.success(
          res?.message || 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập lại.'
        );

        this.loading.set(false);

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },

      error: (err) => {
        console.error('Lỗi đặt lại mật khẩu:', err);

        this.toastService.error(
          err?.message || 'Đặt lại mật khẩu thất bại. Vui lòng thử lại.'
        );

        this.loading.set(false);
      }
    });
  }
}