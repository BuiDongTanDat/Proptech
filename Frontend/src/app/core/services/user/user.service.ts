import { Injectable } from '@angular/core';
import { IUserAccount } from '../../models/model';
import { environment } from '../../../../environments/environment';
import { ApiService } from '../api.service';
import { UserRole } from '../../enum/enums';
import { ApiResponse } from '../../models/response';

export interface UserRequest {
  name: string;
  email: string;
  role: UserRole;
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

  private baseUrl = `${environment.apiUrl}${environment.endpoints.auth}`;

  getUsers() {
    return this.apiService.get<IUserAccount[]>(
      '',
      { baseUrl: this.baseUrl }
    );
  }

  register(request: UserRequest) {
    return this.apiService.post<IUserAccount>(
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
