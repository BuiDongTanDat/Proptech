import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../shared/components/ui/button/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-page',
  imports: [
    ReactiveFormsModule,
    LucideDynamicIcon,
    CustomInput,
    Button
  ],
  templateUrl: './forgot-page.html',
  styleUrl: './forgot-page.css',
})
export class ForgotPage {
  forgotForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });
  submitted = false;

  constructor(private router: Router) { }

  get f() {
    return this.forgotForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.forgotForm.invalid) return;
    // Xử lý gửi email tại đây
    console.log(this.forgotForm.value);
  }

  onBackToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
