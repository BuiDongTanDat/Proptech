import { Injectable } from "@angular/core";
import { ApiService } from "../api.service";
import { environment } from "../../../../environments/environment";
import { IPost } from "../../models/model";
import { Form } from "@angular/forms";


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
  constructor(
    private apiService: ApiService
  ) { }

  baseUrl = `${environment.apiUrl}${environment.endpoints.posts}`; // Sử dụng URL từ environment

  getAllPosts(
    params: {
      page?: number;
      limit?: number;
    }
  ) {
    return this.apiService.get<IPost[]>(
      '',
      {
        baseUrl: this.baseUrl,
        params: {
          page: params.page ?? 1,
          limit: params.limit ?? 12,
        }
      }

    );
  }

  getPostById(id: string) {
    return this.apiService.get<IPost>(`${id}`,
      { baseUrl: this.baseUrl }
    );
  }

  createPost(postData: FormData) {
    return this.apiService.post<IPost>('',
      postData,
      { baseUrl: this.baseUrl }
    );
  }

  updatePost(id: string, postData: FormData) {
    return this.apiService.put<IPost>(`${id}`,
      postData,
      { baseUrl: this.baseUrl }
    );
  }
}