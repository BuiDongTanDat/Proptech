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
import { getAccountStatusBgClass, getAccountStatusClass, getRoleClass } from '../../../../shared/utils/helper';
import { AccountStatus, UserRole } from '../../../../core/enum/enums';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthStore } from '../../../../core/stores/auth.store';
@Component({
  selector: 'app-users-list-page',
  imports: [
    CommonModule, FormsModule, LucideDynamicIcon, Pagination,
    Button, CustomInput, Dropdown, UsersForm, Dialog, ConfirmDialog, Loading,
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
  protected toastService = inject(ToastService);
  protected readonly authStore = inject(AuthStore);

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

  isCurrentUser(user: IUserAccount): boolean {
    return user._id === this.authStore.user()?._id;
  }

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

  onDelete(user: IUserAccount | null) {
    // Called from form: keep form open, just show confirm dialog
    this.selectedUser.set(user);
    this.showDeleteConfirm.set(true);
  }

  confirmDelete() {
    const user = this.selectedUser();
    if (user?._id) {
      this.store.removeUser(user._id);
    }
    this.showDeleteConfirm.set(false);
    this.showFormDialog.set(false); // Close the form after confirm
  }

  onSaveUser(userData: any) {
    const action$ = this.formMode() === 'add'
      ? this.store.addUser(userData)
      : this.store.updateUser({ ...this.selectedUser()!, ...userData });

    if (action$) {
      action$.subscribe({
        next: (res) => {
          // Chỉ đóng form khi API trả về thành công
          this.showFormDialog.set(false);
          this.selectedUser.set(null);
          this.toastService.success(res.message || 'Lưu thành công'); // Hiển thị toast thành công

        },
        error: (err) => {
          // Không đóng form để user thấy lỗi hoặc sửa lại dữ liệu
          console.error('Save failed', err.error.message);
          this.toastService.error(err.error.message || 'Lưu thất bại'); // Hiển thị toast lỗi
        }
      });
    }
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
    // Do not close the form, just hide confirm dialog
  }

  getStatusTextClass(status: AccountStatus) {
    return getAccountStatusClass(status);
  }

  getStatusBgClass(status: AccountStatus) {
    return getAccountStatusBgClass(status);
  }

  getRoleClass(role: UserRole) {
    return getRoleClass(role);
  }
}