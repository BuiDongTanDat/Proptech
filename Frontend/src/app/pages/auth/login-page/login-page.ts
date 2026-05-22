import { Component, inject, signal, ViewChild } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Toast } from '../../../shared/components/toast/toast';
import { ToastService } from '../../../core/services/toast/toast.service';
import { AuthStore } from '../../../core/stores/auth.store';
import { delay, finalize } from 'rxjs/operators';


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

  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private authStore = inject(AuthStore);
  private router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  submitted = false;
  loading = signal<boolean>(false);

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {

    this.submitted = true;
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { email, password } = this.loginForm.value;
    this.authService.login(email, password)
      .subscribe({
        next: (response: any) => {
          this.loading.set(false);
          this.authStore.setUser(response.data);
          this.toastService.success(response.message || 'Đăng nhập thành công');
          this.router.navigate(['/admin/dashboard']);
        },
        error: (error) => {
          this.loading.set(false);
          this.toastService.error(error?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        },

      });


  }

  showPassword = false;
  onTogglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


}
