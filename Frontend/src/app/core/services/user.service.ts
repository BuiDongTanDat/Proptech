import { inject, Injectable } from '@angular/core';
import { IUserAccount } from '../models/model';
import { environment } from '../../../environments/environment';
import { UserRole } from '../enum/enums';
import { HttpClient } from '@angular/common/http';
import { ApiResponse } from '../models/response';

export interface UserRequest {
  name: string;
  email: string;
  role: UserRole;
}


@Injectable({
  providedIn: 'root',
})
export class UserService {

  private userEndpoint = `${environment.apiUrl}${environment.endpoints.auth}`;
  private http = inject(HttpClient);

  getUsers() {
    return this.http.get<ApiResponse<IUserAccount[]>>(`${this.userEndpoint}`);
  }

  register(request: UserRequest) {
    return this.http.post<ApiResponse<any>>(`${this.userEndpoint}/register`, request);
  }

  resend(_id: string) {
    return this.http.post<ApiResponse<any>>(`${this.userEndpoint}/resend`, { _id });
  }
}
