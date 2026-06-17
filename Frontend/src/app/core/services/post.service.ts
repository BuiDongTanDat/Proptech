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
    type: string,
    page: number = 1,
    category?: string,
    status?: string
  ) {
    let url = `${this.postEndpoint}/${type}?page=${page}`;
    if (category) {
      url += `&category=${category}`;
    }
    if (status) {
      url += `&status=${status}`;
    }
    return this.http.get<PaginatedPostResponse>(url);
  }

  getPostById(type: string, id: string) {
    return this.http.get<ApiResponse<IPost>>(`${this.postEndpoint}/${type}/${id}`);
  }

  createPost(type: string, postData: FormData) {
    return this.http.post<ApiResponse<IPost>>(
      `${this.postEndpoint}/${type}`,
      postData,
    );
  }

  updatePost(type: string, id: string, postData: FormData) {
    return this.http.patch<ApiResponse<IPost>>(`${this.postEndpoint}/${type}/${id}`,
      postData,
    );
  }

  updatePostStatus(
    type: string,
    id: string,
    payload: {
      status: PropertyStatus;
      reason?: string;
    }
  ) {
    return this.http.patch<ApiResponse<IPost>>(
      `${this.postEndpoint}/${type}/${id}`,
      payload
    );
  }

  // Tìm bài đăng nội bộ (dành cho admin)
  searchPosts(
    type: string,
    page: number,
    keyword: string,
  ) {
    const url = `${this.postEndpoint}/${type}/search?page=${page}&keyword=${encodeURIComponent(keyword)}`;
    return this.http.get<PaginatedPostResponse>(url);

  }

  // Tìm bài đăng công khai (client)
  searchPublicPosts(
    type: string,
    page: number,
    keyword: string,
  ) {
    const url = `${this.postEndpoint}/${type}/public/search?page=${page}&keyword=${encodeURIComponent(keyword)}`;
    return this.http.get<PaginatedPostResponse>(url);
  }

  // Lấy toàn bộ bài đăng công khai (client)
  getAllPublicPosts(
    type: string,
    page: number = 1,
  ) {
    return this.http.get<PaginatedPostResponse>(`${this.postEndpoint}/${type}/public?page=${page}`);
  }

  // Lấy bài đăng công khai theo ID (client)
  getPublicPostById(type: string, id: string) {
    return this.http.get<ApiResponse<IPost>>(`${this.postEndpoint}/${type}/public/${id}`);
  }
}