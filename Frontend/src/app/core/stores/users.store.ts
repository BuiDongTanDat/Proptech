import { Injectable, signal, computed, inject } from '@angular/core';
import { UserRequest, UserService } from '../services/user.service';
import { IUserAccount } from '../models/model';
import { ToastService } from '../services/toast.service';
import { finalize, tap } from 'rxjs';
import { USER_ROLE_OPTIONS } from '../constants/user.constant';
import { DateSort, UserRole } from '../enum/enums';

@Injectable({ providedIn: 'root' })
export class UserStore {
    private userService = inject(UserService);
    private toastService = inject(ToastService);
    
    // State
    private _users = signal<IUserAccount[]>([]);

    readonly loading = signal<boolean>(false);
    readonly resendLoading = signal<boolean>(false);
    readonly submitLoading = signal<boolean>(false); // add / edit

    readonly searchQuery = signal('');
    readonly selectedSort = signal(DateSort.DEFAULT); // Mặc định là 'default'
    readonly selectedRole = signal(USER_ROLE_OPTIONS[0].value); // Mặc định là 'all'
    readonly currentPage = signal(1);
    readonly pageSize = signal(8); // Cố định 8 user mỗi trang

    // Computed State (Tự động chạy lại khi các tín hiệu trên thay đổi)
    readonly filteredUsers = computed(() => {
        let result = [...this._users()];
        const query = this.searchQuery().toLowerCase().trim();

        if (query) {
            result = result.filter(u =>
                u.name.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
        }

        // Apply role filter if set
        const roleFilter = this.selectedRole();
        if (roleFilter && roleFilter !== USER_ROLE_OPTIONS[0].value) { // Nếu không phải 'all'
            result = result.filter(u => u.role === roleFilter);
        }

        // Apply sort options
        switch (this.selectedSort()) {
            case DateSort.NEWEST:
                result.sort((a, b) => {
                    const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return dateB.getTime() - dateA.getTime();
                });
                break;
            case DateSort.OLDEST:
                result.sort((a, b) => {
                    const dateA = new Date(a._id ? parseInt(a._id.substring(0, 8), 16) * 1000 : 0);
                    const dateB = new Date(b._id ? parseInt(b._id.substring(0, 8), 16) * 1000 : 0);
                    return dateA.getTime() - dateB.getTime();
                });
                break;
            case DateSort.DEFAULT:
            default:
                break;
        }

        return result;
    });

    readonly totalPages = computed(() =>
        Math.ceil(this.filteredUsers().length / this.pageSize()) || 1
    );

    readonly paginatedUsers = computed(() => {
        const start = (this.currentPage() - 1) * this.pageSize();
        return this.filteredUsers().slice(start, start + this.pageSize());
    });

    // Actions
    loadUsers() {
        this.loading.set(true);
        this.userService.getUsers()
            .pipe(finalize(() => this.loading.set(false)))
            .subscribe({
                next: res => this._users.set(res.data),
                error: err => this.toastService.error(err?.error?.message || 'Lỗi tải danh sách')
            });
    }

    addUser(payload: UserRequest) {
        this.submitLoading.set(true);
        // Trả về Observable để Component có thể subscribe
        return this.userService.register(payload).pipe(
            tap(res => {
                this._users.update(list => [...list, res.data]);
                this.toastService.success(res?.message || 'Thêm người dùng thành công! Một email xác thực đã được gửi đến người dùng.');
            }),
            finalize(() => this.submitLoading.set(false))
        );
    }

    updateUser(updated: IUserAccount) {
        // Giả sử có API update, ở đây update local state
        this._users.update(list => list.map(u => u._id === updated._id ? updated : u));
        this.toastService.success('Cập nhật thành công');
    }

    removeUser(id: string) {
        this._users.update(list => list.filter(u => u._id !== id));
        this.toastService.success('Đã xóa người dùng');
    }

    setPage(page: number) {
        this.currentPage.set(page);
    }

    setSearch(query: string) {
        this.searchQuery.set(query);
        this.currentPage.set(1); // Reset page khi search
    }

    setSort(sort: string) {
        this.selectedSort.set(sort as DateSort);
        this.currentPage.set(1); // Reset page khi sort
    }

    setRole(role: string) {
        this.selectedRole.set(role as UserRole);
        this.currentPage.set(1); // Reset trang khi lọc theo vai trò
    }

    resendVerification(id: string) {
        this.resendLoading.set(true);
        this.userService.resend(id)
            .pipe(finalize(() => this.resendLoading.set(false)))
            .subscribe({
                next: (res: any) => {
                    this.toastService.success(res?.message || 'Email xác thực đã được gửi lại thành công!');
                },
                error: err => {
                    this.toastService.error(err?.error?.message || 'Có lỗi xảy ra khi gửi lại email');
                }
            });
    }
}