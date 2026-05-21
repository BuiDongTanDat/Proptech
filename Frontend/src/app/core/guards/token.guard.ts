import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TokenGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const token = route.queryParamMap.get('token');
    if (token && token.length > 0) {
      return true;
    } else {
      this.router.navigate(['/auth/login']); // Chuyển hướng về trang login nếu không có token
      return false;
    }
  }
}
