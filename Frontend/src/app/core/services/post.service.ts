import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IPost } from "../models/model";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../models/response";
import { PropertyStatus } from "../enum/enums";


export interface PaginatedPostResponse {
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalPosts: number;
  };
  data: {
    status: {
      [key: string]: number;
    };
    posts: IPost[];
  };
}


@Injectable({
  providedIn: 'root',
})
export class PostService {

  postEndpoint = `${environment.apiUrl}${environment.endpoints.posts}`; // Sử dụng URL từ environment
  private http = inject(HttpClient);

  // Nếu ko có categoryId thì trả về tất cả bài đăng, có categoryId thì trả về bài đăng theo danh mục đó
  getAllPosts(
    page: number = 1,
    category?: string,
    status?: string
  ) {
    let url = `${this.postEndpoint}?page=${page}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<PaginatedPostResponse>(url);
  }

  getPostById(id: string) {
    return this.http.get<ApiResponse<IPost>>(`${this.postEndpoint}/${id}`);
  }

  createPost(postData: FormData) {
    return this.http.post<ApiResponse<IPost>>(`${this.postEndpoint}`,
      postData,
    );
  }

  updatePost(id: string, postData: FormData) {
    return this.http.patch<ApiResponse<IPost>>(`${this.postEndpoint}/${id}`,
      postData,
    );
  }

  updatePostStatus(
    id: string,
    payload: {
      status: PropertyStatus;
      reason?: string;
    }
  ) {
    return this.http.patch<ApiResponse<IPost>>(
      `${this.postEndpoint}/${id}`,
      payload
    );
  }
}