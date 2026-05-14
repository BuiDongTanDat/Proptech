
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Button } from '../../../../shared/components/ui/button/button';
import { LucideDynamicIcon } from '@lucide/angular';
import { UserAccount } from '../../../../shared/utils/data.mock';
import { Dropdown } from "../../../../shared/components/dropdown/dropdown";
import { CustomDatePicker } from '../../../../shared/components/custom-date-picker/custom-date-picker';

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
export class UsersForm implements OnInit {
  @Input() user: UserAccount | null = null;
  @Input() mode: 'view' | 'edit' | 'add' = 'view';
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<UserAccount>();

  userForm: FormGroup = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required]),
    role: new FormControl('staff', [Validators.required]),
    status: new FormControl('active', [Validators.required]),
    avatar: new FormControl(''),
    createdAt: new FormControl({ value: '', disabled: true }),
  });

  submitted = false;
  editable = false;

  ngOnInit() {
    if (this.user && (this.mode === 'edit' || this.mode === 'view')) {
      this.userForm.patchValue({
        ...this.user
      });
      if (this.mode === 'view') {
        this.userForm.disable();
        this.editable = false;
      } else {
        this.userForm.enable();
        this.userForm.get('createdAt')?.disable();
        this.editable = true;
      }
    } else if (this.mode === 'add') {
      this.userForm.reset();
      this.userForm.enable();
      this.userForm.get('createdAt')?.disable();
      this.editable = true;
    }
  }

  get f() {
    return this.userForm.controls;
  }

  onEdit() {
    this.editable = true;
    this.userForm.enable();
    this.userForm.get('createdAt')?.disable();
  }

  onCancel() {
    if (this.user) {
      this.userForm.patchValue({ ...this.user });
    }
    this.userForm.disable();
    this.userForm.get('createdAt')?.disable();
    this.editable = false;
    this.submitted = false;
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) return;
    const formValue = this.userForm.getRawValue();
    const payload: UserAccount = {
      id: this.user?.id ?? Date.now(),
      fullName: formValue.fullName,
      email: formValue.email,
      phone: formValue.phone,
      role: formValue.role,
      status: formValue.status,
      avatar: formValue.avatar,
      createdAt: formValue.createdAt || new Date().toISOString().slice(0, 10),
    };
    this.save.emit(payload);
    this.editable = false;
    this.userForm.disable();
    this.userForm.get('createdAt')?.disable();
  }

  onClose() {
    this.close.emit();
  }
}
