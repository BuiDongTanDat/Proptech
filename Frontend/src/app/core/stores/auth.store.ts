// auth.store.ts
import { inject, Injectable, signal, computed } from '@angular/core';
import { IUserAccount } from '../models/model';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthStore {
    private authService = inject(AuthService);
    private toastService = inject(ToastService);

    // State
    readonly user = signal<IUserAccount | null>(this.authService.getUser());
    // Kiểm tra phiên làm việc đã được kiểm tra thành công với Backend qua API /me hay chưa
    readonly isVerified = signal<boolean>(false);

    readonly isLoggedIn = computed(() => !!this.user());

    setUser(user: IUserAccount | null) {
        // Cập nhật Signal để UI thay đổi ngay lập tức
        this.user.set(user);
        // Lưu vào localStorage để khi F5 không mất dữ liệu
        this.authService.setUser(user);
    }

    /*
     Xác thực phiên đăng nhập thực tế của người dùng bằng cách gọi API /me.
     Trả về một Observable<boolean> biểu thị trạng thái đăng nhập thực tế từ Server.
     */
    verifySession(): Observable<boolean> {
        return this.authService.authMe().pipe(
            tap((response) => {
                // response nhận về có cấu trúc ApiResponse<IUserAccount>
                // thuộc tính 'data' chứa thông tin IUserAccount thực tế để lưu vào store
                this.setUser(response.data);
                this.isVerified.set(true);
            }),
            map(() => true),
            catchError(() => {
                // Nếu API trả về lỗi (ví dụ: 401 Unauthorized và refresh token thất bại)
                // xóa sạch dữ liệu cục bộ
                this.setUser(null);
                this.isVerified.set(false);
                return of(false);
            })
        );
    }

    logout() {
        return this.authService.logout().pipe(
            tap((res: any) => {
                this.user.set(null);
                this.authService.setUser(null);
                this.isVerified.set(false);
                this.toastService.success(res.message || 'Đã đăng xuất thành công!');
            }),
            catchError((err) => {
                this.toastService.error(err.error?.message || 'Không thể đăng xuất');
                throw err;
            })
        );
    }

    //PHÂN QUYỀN

    // Xét điều kiện để render dữ liệu theo role
    hasRole(...roles: string[]): boolean {
        const userRole = this.user()?.role;
        return !!userRole && roles.includes(userRole);
    }

    readonly isManager = computed(() =>
        this.hasRole('Quản lý')
    );

    readonly isAdmin = computed(() =>
        this.hasRole('Nhân viên')
    );

    readonly canApprovePost = computed(() =>
        this.hasRole('Quản lý')
    );

    
}