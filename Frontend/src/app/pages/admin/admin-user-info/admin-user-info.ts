import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';

import { Button } from '../../../shared/components/ui/button/button';
import { CustomInput } from '../../../shared/components/ui/custom-input/custom-input';
import { AuthStore } from '../../../core/stores/auth.store';
import { ToastService } from '../../../core/services/toast/toast.service';
import { IUserAccount } from '../../../core/models/model';
import { CustomNamePipe } from '../../../core/pipes/custom-name.pipe';

@Component({
  selector: 'app-admin-user-info',
  imports: [CommonModule, FormsModule, LucideDynamicIcon, Button, CustomInput, CustomNamePipe],
  templateUrl: './admin-user-info.html',
  styleUrl: './admin-user-info.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminUserInfo {
  private authStore = inject(AuthStore);
  private toast = inject(ToastService);

  // State
  isEditing = signal(false);
  tempUser = signal<IUserAccount>({} as IUserAccount);

  // Derived State (Computed)
  // Đảm bảo luôn có object để tránh lỗi template khi user null
  currentUser = computed(() => this.authStore.user() ?? ({} as IUserAccount));

  constructor() {
    // Tự động cập nhật form khi dữ liệu gốc thay đổi hoặc khi tắt chế độ edit
    effect(() => {
      if (!this.isEditing()) {
        this.tempUser.set({ ...this.currentUser() });
      }
    });
  }

  onEdit() {
    this.isEditing.set(true);
  }

  onCancel() {
    this.isEditing.set(false);
  }

  onSave() {
    // Gọi API cập nhật ở đây nếu có, sau đó cập nhật store
    this.authStore.setUser(this.tempUser());
    this.isEditing.set(false);
    this.toast.success('Cập nhật thông tin thành công!');
  }

  // Helper update signal cho template
  updateTempUser(field: keyof IUserAccount, value: string) {
    this.tempUser.update(prev => ({ ...prev, [field]: value }));
  }
}