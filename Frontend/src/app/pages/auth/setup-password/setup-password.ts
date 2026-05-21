import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Toast } from '../../../shared/components/toast/toast';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-setup-password',
  imports: [
    LucideDynamicIcon,
    ReactiveFormsModule,
    CustomInput,
    Button,
    Toast
  ],
  templateUrl: './setup-password.html',
  styleUrl: './setup-password.css',
})
export class SetupPassword implements AfterViewInit {

  token: string | null = null;
  submitted = false;
  showNewPassword = false;
  showConfirmPassword = false;

  setupForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ]),
  });

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
    return this.setupForm.controls;
  }

  get passwordMismatch(): boolean {
    return (
      this.setupForm.value.newPassword !==
      this.setupForm.value.confirmPassword
    );
  }

  onSubmit() {
    this.submitted = true;

    if (this.setupForm.invalid) return;
    if (this.passwordMismatch) return;

    if (!this.token) {
      this.toastService.error('Thiếu token xác thực!');
      return;
    }

    const password = this.setupForm.value.newPassword;

    this.authService.setupPassword(this.token, password).subscribe({
      next: (res) => {
        this.toastService.success(res?.message || 'Thiết lập mật khẩu thành công! Vui lòng đăng nhập.');

        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 1500);
      },

      error: (err) => {
        this.toastService.error(err?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    });
  }
}