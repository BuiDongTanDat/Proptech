// no-auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';
import { map } from 'rxjs/operators';

export const NoAuthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Nếu đã được backend xác thực thành công trước đó, 
  // chuyển hướng ngay về trang chủ
  if (authStore.isVerified()) {
    router.navigate(['/admin']);
    return false;
  }

  // Nếu có dữ liệu đăng nhập cũ ở localStorage, 
  // verify lại với backend xem có thực sự hợp lệ không
  if (authStore.isLoggedIn()) {
    return authStore.verifySession().pipe(
      map((isValid) => {
        if (isValid) {
          router.navigate(['/']);
          return false; // Đã đăng nhập thực tế -> không cho vào trang auth
        }
        return true; // Session lưu ở local thực chất đã hết hạn -> cho phép vào trang auth để login lại
      })
    );
  }

  // Trường hợp chưa từng đăng nhập, cho phép truy cập bình thường
  return true;
};