import { Component } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    RouterLink,
    LucideDynamicIcon,
    ReactiveFormsModule,
    CustomInput,
    Button
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  submitted = false;

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log('Dữ liệu gửi đi:', this.loginForm.value);
  }

  showPassword = false;
  onTogglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


}
