
import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'auth_user';

  baseUrl = environment.userServiceUrl; // Sử dụng URL từ environment

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

  login(email: string, password: string) {
    return this.apiService.post(
      'login',
      { email, password },
      { baseUrl: this.baseUrl }
    );
  }

  setUser(user: any) {
    localStorage.clear(); // Xóa tất cả dữ liệu cũ trước khi lưu user mới
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  getUser() {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  // Thiết lập mật khẩu lần đầu
  setupPassword(token: string, password: string): Observable<any> {
    return this.apiService.post(
      'setup', // endpoint
      { password }, // body
      {
        token: token, // token cho header Authorization
        baseUrl: this.baseUrl
      } // options 
    );
  }

  // Yêu cầu đổi mật khẩu (quên mật khẩu)
  requestPasswordReset(email: string): Observable<any> {
    return this.apiService.post(
      'request-reset-password', // endpoint
      { email }, // body
      { baseUrl: this.baseUrl } // options
    );
  }

  // Đổi mật khẩu từ link reset
  resetPassword(token: string, password: string): Observable<any> {
    return this.apiService.post(
      'reset-password', // endpoint
      { password }, // body
      {
        token: token, // token cho header Authorization
        baseUrl: this.baseUrl
      } // options 
    );
  }

  // refresh token - gửi refresh bên trong cookie sang backend
  refreshToken(): Observable<any> {
    return this.apiService.post(
      'refresh', // endpoint
      {}, // body rỗng
      { baseUrl: this.baseUrl } // options
    );
  }

  logout() {
    localStorage.removeItem(this.USER_KEY);
    this.router.navigate(['/auth/login']);
  }
}
