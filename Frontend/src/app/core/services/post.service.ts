import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IPost } from "../models/model";
import { HttpClient } from "@angular/common/http";
import { ApiResponse } from "../models/response";


export interface PaginatedPostResponse {
  message: string;
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
  };
  data: IPost[];
}


@Injectable({
  providedIn: 'root',
})
export class PostService {

  postEndpoint = `${environment.apiUrl}${environment.endpoints.posts}`; // Sử dụng URL từ environment
  private http = inject(HttpClient);

  getAllPosts(
    page: number = 1,
    categoryId?: string
  ) {
    let url = `${this.postEndpoint}?page=${page}`;
    if (categoryId && categoryId !== 'all') {
      url += `&categoryId=${categoryId}`;
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
    return this.http.put<ApiResponse<IPost>>(`${this.postEndpoint}/${id}`,
      postData,
    );
  }
}