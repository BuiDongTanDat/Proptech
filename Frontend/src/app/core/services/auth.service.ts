
import { Inject, inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/response';
import { IUserAccount } from '../models/model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly USER_KEY = 'auth_user';

  authEndpoint = `${environment.apiUrl}${environment.endpoints.auth}`; // Sử dụng URL từ environment

  private http = inject(HttpClient);
  private router = inject(Router);


  // Chỉ cần truyền đường dẫn tương đối dạng: auth/me, auth/login
  authMe(): Observable<ApiResponse<IUserAccount>> {
    return this.http.get<ApiResponse<IUserAccount>>(`${this.authEndpoint}/me`);
  }

  login(email: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.authEndpoint}/login`, { email, password });
  }

  setUser(user: IUserAccount | null) {
    if (user) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.USER_KEY);
    }
  }

  getUser(): IUserAccount | null {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getUser();
  }

  setupPassword(token: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(
      `${this.authEndpoint}/setup`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } } // Truyền token thủ công khi cần thiết
    );
  }

  requestPasswordReset(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.authEndpoint}/request-reset-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<ApiResponse<any>> {
    return this.http.put<ApiResponse<any>>(
      `${this.authEndpoint}/reset-password`,
      { password },
      { headers: { Authorization: `Bearer ${token}` } } // Truyền token thủ công khi cần thiết
    );
  }

  refreshToken(): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.authEndpoint}/refresh`, {});
  }

  logout() {
    return this.http.post(`${this.authEndpoint}/logout`, {});
  }
}
