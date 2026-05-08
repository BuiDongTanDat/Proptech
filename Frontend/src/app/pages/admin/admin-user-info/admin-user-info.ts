import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { Button } from '../../../shared/components/ui/button/button';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';


@Component({
  selector: 'app-admin-user-info',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideDynamicIcon,
    Button,
    CustomInput,
  ],
  templateUrl: './admin-user-info.html',
  styleUrl: './admin-user-info.css',
})
export class AdminUserInfo {

  isEditing = false;

  user = {
    fullName: 'Tan Da Tan',
    email: 'tan.nguyen@gmail.com',
    phone: '0901234567',
    role: 'admin',
    address: 'Quận 1, TP.HCM',
    bio: 'Quản trị viên hệ thống nền tảng bất động sản.',
  };

  tempUser = { ...this.user };

  onEdit() {
    this.isEditing = true;
    this.tempUser = { ...this.user };
  }

  onCancel() {
    this.isEditing = false;
    this.tempUser = { ...this.user };
  }

  onSave() {
    this.user = { ...this.tempUser };
    this.isEditing = false;
  }

  get initials(): string {
    return this.user.fullName
      .split(' ')
      .map(n => n.charAt(0))
      .slice(-2)
      .join('')
      .toUpperCase();
  }
}