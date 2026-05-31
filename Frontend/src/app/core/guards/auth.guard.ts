// auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../stores/auth.store';
import { map } from 'rxjs/operators';

export const AuthGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  // Nếu đã xác thực thành công với backend trong phiên hiện tại, 
  // cho qua ngay lập tức
  if (authStore.isVerified()) {
    return true;
  }

  // Call API /me qua verifySession() để kiểm tra
  return authStore.verifySession().pipe(
    map((isValid) => {
      if (isValid) {
        return true;
      }

      // Nếu không hợp lệ (hết hạn hoặc token sai), điều hướng về trang đăng nhập
      router.navigate(['/auth']);
      return false;
    })
  );
};