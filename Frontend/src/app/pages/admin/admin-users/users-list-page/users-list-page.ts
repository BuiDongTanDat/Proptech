import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { UsersForm } from '../users-form/users-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { IUserAccount } from '../../../../core/models/model';
import { UserStore } from '../../../../core/stores/users.store';
import { Loading } from '../../../../shared/components/loading/loading';

@Component({
  selector: 'app-users-list-page',
  imports: [
    CommonModule, FormsModule, LucideDynamicIcon, Pagination,
    Button, CustomInput, Dropdown, UsersForm, Dialog, ConfirmDialog, Loading
  ],
  templateUrl: './users-list-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class UsersListPage implements OnInit {
  // Inject store công khai để template truy cập trực tiếp
  protected readonly store = inject(UserStore);

  // UI State (Chỉ giữ lại state liên quan đến hiển thị)
  isListView = signal(false);
  isMobile = signal(false);
  showFormDialog = signal(false);
  showDeleteConfirm = signal(false);
  formMode = signal<'view' | 'edit' | 'add'>('view');
  selectedUser = signal<IUserAccount | null>(null);

  sortOptions = [
     { label: 'Sắp xếp', value: 'default' },
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Quản lý', value: 'admin' },
    { label: 'Nhân viên', value: 'staff' },
  ];

  ngOnInit(): void {
    this.onResize();
    this.store.loadUsers();
  }

  onResize() {
    this.isMobile.set(window.innerWidth < 768);
  }

  // Handlers gọi sang Store
  onSearch(val: string) {
    this.store.setSearch(val);
  }

  onSortChange(val: string) {
    this.store.setSort(val);
  }

  onPageChange(page: number) {
    this.store.setPage(page);
  }

  setListView(isList: boolean) {
    this.isListView.set(isList);

  }

  // UI Logic
  onAdd() {
    this.formMode.set('add');
    this.selectedUser.set(null);
    this.showFormDialog.set(true);
  }

  onEdit(user: IUserAccount) {
    this.formMode.set('edit');
    this.selectedUser.set(user);
    this.showFormDialog.set(true);
  }

  onDelete(user: IUserAccount) {
    this.selectedUser.set(user);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (user?._id) {
      this.store.removeUser(user._id);
      this.showDeleteConfirm.set(false);
    }
  }

  onSaveUser(userData: any) {
    if (this.formMode() === 'add') {
      this.store.addUser(userData);
    } else {
      this.store.updateUser({ ...this.selectedUser()!, ...userData });
    }
    this.showFormDialog.set(false);
  }

  // Xem user (mở dialog readonly)
  onView(user: IUserAccount) {
    this.formMode.set('view');
    this.selectedUser.set(user);
    this.showFormDialog.set(true);
  }

  // Đóng form dialog
  closeFormDialog() {
    this.showFormDialog.set(false);
    this.selectedUser.set(null);
  }

  // Hủy delete dialog
  cancelDelete() {
    this.showDeleteConfirm.set(false);
    this.selectedUser.set(null);
  }
}