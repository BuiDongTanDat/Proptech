import { Injectable } from '@angular/core';
import { IUserAccount } from '../../models/model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api.service';

export interface UserRequest {
  name: string;
  email: string;
  role: 'Quản lý' | 'Nhân viên' | 'Thực tập sinh';
}

export interface UserResponse {
  message: string;
  data: IUserAccount[];
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private apiService: ApiService
  ) { }

  baseUrl = environment.userServiceUrl; // Sử dụng URL từ environment

  getUsers() {
    return this.apiService.get<UserResponse>(
      '',
      { baseUrl: this.baseUrl }
    );
  }

  register(request: UserRequest) {
    return this.apiService.post<UserResponse>(
      'register',
      request,
      { baseUrl: this.baseUrl });
  }

  resend(_id: string) {
    return this.apiService.post(
      'resend',
      { _id },
      { baseUrl: this.baseUrl }
    );
  }
}
