import { Component, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Toast } from '../../../shared/components/toast/toast';
import { ToastService } from '../../../core/services/toast/toast.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    RouterLink,
    LucideDynamicIcon,
    ReactiveFormsModule,
    CustomInput,
    Button,
    Toast
],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  constructor(
    private authService: AuthService,
    private toastService: ToastService, 
    private router: Router
  ) { }


  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  submitted = false;
  loading = false;

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    //console.log('Dữ liệu gửi đi:', this.loginForm.value);
    if (this.loginForm.invalid) return; // Dừng nếu form không hợp lệ

    this.loading = true;
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (response: any) => {
        console.log('Đăng nhập thành công:', response);
        // Lưu data user vào AuthService
        this.authService.setUser(response.data);
        this.toastService.success(response.message || 'Đăng nhập thành công');
        this.router.navigate(['/admin/dashboard']); // Chuyển hướng sau khi đăng nhập thành công
      },
      error: (error) => {
        console.error('Đăng nhập thất bại:', error);
        this.loading = false;
        this.toastService.error(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    });


  }

  showPassword = false;
  onTogglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


}
