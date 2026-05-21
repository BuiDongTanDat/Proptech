import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideDynamicIcon } from '@lucide/angular';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Button } from '../../../../shared/components/ui/button/button';
import { CustomInput } from '../../../../shared/components/ui/custom-input/custom-input';
import { Dropdown } from '../../../../shared/components/dropdown/dropdown';
import { UsersForm } from '../users-form/users-form';
import { Dialog } from '../../../../shared/components/dialog/dialog';
import { IUserAccount } from '../../../../core/models/model';
import { UserRequest, UserService } from '../../../../core/services/user/user.service';
import { UserStore } from '../../../../core/stores/user.store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmDialog } from '../../../../shared/components/confirm-dialog/confirm-dialog';
import { ToastService } from '../../../../core/services/toast/toast.service';

@Component({
  selector: 'app-users-list-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideDynamicIcon,
    Pagination,
    Button,
    CustomInput,
    Dropdown,
    UsersForm,
    Dialog,
    ConfirmDialog
  ],
  templateUrl: './users-list-page.html',
})
export class UsersListPage implements OnInit {
  private userService = inject(UserService);
  private userStore = inject(UserStore);
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);

  constructor() {
    // Subscribe sớm để không miss emit, nhưng dùng takeUntilDestroyed
    this.userStore.users$
      .pipe(takeUntilDestroyed())
      .subscribe(users => {
        this.allUsers = users;
        this.applyFilters();
        this.cdr.markForCheck();
      });
  }

  ngOnInit(): void {
    this.checkMobile();
    this.getUsers();
  }


  allUsers: IUserAccount[] = [];
  filteredUsers: IUserAccount[] = [];
  users: IUserAccount[] = []; // chỉ render page hiện tại
  loading = false;
  showDeleteConfirm = false;

  currentPage = 1;
  pageSize = 6;
  totalPages = 1;

  isListView = false;
  isMobile = false;
  searchQuery = '';

  sortOptions = [
    { label: 'Mới nhất', value: 'newest' },
    { label: 'Cũ nhất', value: 'oldest' },
    { label: 'Admin trước', value: 'admin' },
    { label: 'Nhân viên trước', value: 'staff' },
  ];

  selectedSort = 'newest';

  // Form state
  showFormDialog: boolean = false;
  formMode: 'view' | 'edit' | 'add' = 'view';
  selectedUser: IUserAccount | null = null;




  @HostListener('window:resize')
  onResize() {
    this.checkMobile();
  }

  //Call API    
  getUsers() {
    // Có thể dùng data từ store nếu đã có (tránh gọi API lại khi navigate)
    if (this.userStore.getSnapshot().length > 0) {
      return; // Đã có data, không cần gọi lại
    }

    this.loading = true;
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.userStore.setUsers(res.data);
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  checkMobile() {
    this.isMobile = window.innerWidth < 768;
  }

  setView(listView: boolean) {
    this.isListView = listView;
  }

  onSearch() {
    this.applyFilters();
  }

  onSortChange(value: string) {
    this.selectedSort = value;
    this.applyFilters();
  }

  updatePage() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize) || 1;

    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    const start = (this.currentPage - 1) * this.pageSize;
    this.users = this.filteredUsers.slice(start, start + this.pageSize);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  onAdd() {
    this.formMode = 'add';
    this.selectedUser = null;
    this.showFormDialog = true;
  }

  onEdit(user: IUserAccount) {
    this.formMode = 'edit';
    this.selectedUser = user;
    this.showFormDialog = true;
  }

  onView(user: IUserAccount) {
    this.formMode = 'view';
    this.selectedUser = user;
    this.showFormDialog = true;
  }

  // Mở dialog xác nhận trước khi xóa, tránh xóa nhầm
  onDelete(user: IUserAccount) {
    this.showDeleteConfirm = true;
    this.selectedUser = user;
  }

  confirmDelete(user: IUserAccount) {
    this.showDeleteConfirm = false;
    this.userStore.removeUser(user._id!);
    this.applyFilters();
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  // Xử lý lưu (cả thêm mới và cập nhật)
  onSaveUser(userData: any) {
    const payload: UserRequest = {
      name: userData.name,
      email: userData.email,
      role: userData.role
    };

    if (this.formMode === 'add') {
      this.userService.register(payload).subscribe({
        next: (res: any) => {
          const user = res.data;

          const newUser: IUserAccount = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: payload.role,
            status: 'Chờ xác thực',
          };

          this.userStore.addUser(newUser);

          this.toastService.success(
            res.message || 'Người dùng mới đã được tạo thành công!'
          );

          this.applyFilters();
          this.closeFormDialog();
        },
        error: (err) => {
          console.error('Error creating user:', err);
          this.toastService.error(err?.message || 'Có lỗi xảy ra khi tạo người dùng.');
        }
      });
      return; // dừng lại, không chạy tiếp xuống dưới

    } else if (this.formMode === 'edit' && this.selectedUser) {
      const updatedUser: IUserAccount = {
        ...this.selectedUser,
        ...payload,
        _id: this.selectedUser._id,
      };
      this.userStore.updateUser(updatedUser);
    }

    // Chỉ chạy đến đây nếu là edit
    this.applyFilters();
    this.closeFormDialog();
  }

  closeFormDialog() {
    this.showFormDialog = false;
    this.selectedUser = null;
  }

  applyFilters() {
    let result = [...this.allUsers];

    // SEARCH
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();

      result = result.filter(user =>
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q)
      );
    }

    // SORT
    switch (this.selectedSort) {
      case 'admin':
        result.sort((a, b) => a.role === 'Quản lý' ? -1 : 1);
        break;

      case 'staff':
        result.sort((a, b) => a.role === 'Nhân viên' ? -1 : 1);
        break;

      case 'newest':
        // nếu có createdAt thì sort
        break;

      case 'oldest':
        // nếu có createdAt thì sort
        break;
    }

    this.filteredUsers = result;
    this.currentPage = 1;
    this.updatePage();
  }
}