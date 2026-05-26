import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from "@angular/common/http";
import { catchError, Observable, throwError, timeout } from "rxjs";
import { environment } from "../../../environments/environment";
import { ApiErrorResponse, ApiResponse } from "../models/response";


//Interface cho các tùy chọn bổ sung khi gọi API

export interface ApiOptions {
    params?: Record<string, any>;
    headers?: Record<string, string>;
    token?: string;    // Chỉ dùng khi cần gửi token thủ công (ngoài Cookie)
    baseUrl?: string;  // Dùng khi gọi sang một domain khác hoàn toàn
}


@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private readonly apiUrl = environment.apiUrl;
    private readonly DEFAULT_TIMEOUT = 20000;

    constructor(private http: HttpClient) { }

    // Xây dựng URL hoàn chỉnh
    private buildUrl(endpoint: string, baseUrl?: string): string {
        if (endpoint.startsWith('http')) return endpoint;
        const base = baseUrl ?? this.apiUrl;
        // Loại bỏ dấu / thừa ở giữa base và endpoint
        const cleanBase = base.replace(/\/$/, '');
        const cleanEndpoint = endpoint.replace(/^\//, '');
        return cleanEndpoint ? `${cleanBase}/${cleanEndpoint}` : cleanBase;
    }

    /*
      Headers
      Lưu ý: Không set Content-Type thủ công để HttpClient tự động xử lý 
      (JSON sẽ tự set application/json, FormData sẽ tự set multipart/form-data với boundary)
     */
    private buildHeaders(options?: ApiOptions): HttpHeaders {
        let headers = new HttpHeaders(options?.headers || {});

        if (options?.token) {
            headers = headers.set('Authorization', `Bearer ${options.token}`);
        }
        return headers;
    }

    /*
     Query Params
     */
    private buildParams(params?: Record<string, any>): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    httpParams = httpParams.set(key, value.toString());
                }
            });
        }
        return httpParams;
    }

    /*
     Xử lý lỗi tập trung theo format backend
     */
    private handleError(error: HttpErrorResponse): Observable<never> {
        console.error('[ApiService Error]', error);

        const errorRes: ApiErrorResponse = {
            message: error.error?.message || 'Có lỗi xảy ra, vui lòng thử lại',
            error: error.error?.error || 'Unknown Error',
            statusCode: error.status,
            raw: error
        };

        return throwError(() => errorRes);
    }

    // --- CÁC PHƯƠNG THỨC HTTP ---
    // KHi call T/\. API response sẽ trả về 1 object 
    // Bao gồm message, data (theo type T) và có thể có pagination
    get<T>(endpoint: string, options?: ApiOptions): Observable<ApiResponse<T>> {
        return this.http.get<ApiResponse<T>>(this.buildUrl(endpoint, options?.baseUrl), {
            headers: this.buildHeaders(options),
            params: this.buildParams(options?.params),
            withCredentials: true, // Gửi Cookie kèm theo
        }).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    post<T>(endpoint: string, body: any, options?: ApiOptions): Observable<ApiResponse<T>> {
        return this.http.post<ApiResponse<T>>(this.buildUrl(endpoint, options?.baseUrl), body, {
            headers: this.buildHeaders(options),
            params: this.buildParams(options?.params),
            withCredentials: true,
        }).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    put<T>(endpoint: string, body: any, options?: ApiOptions): Observable<ApiResponse<T>> {
        return this.http.put<ApiResponse<T>>(this.buildUrl(endpoint, options?.baseUrl), body, {
            headers: this.buildHeaders(options),
            params: this.buildParams(options?.params),
            withCredentials: true,
        }).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    patch<T>(endpoint: string, body: any, options?: ApiOptions): Observable<ApiResponse<T>> {
        return this.http.patch<ApiResponse<T>>(this.buildUrl(endpoint, options?.baseUrl), body, {
            headers: this.buildHeaders(options),
            params: this.buildParams(options?.params),
            withCredentials: true,
        }).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    delete<T>(endpoint: string, options?: ApiOptions): Observable<ApiResponse<T>> {
        return this.http.delete<ApiResponse<T>>(this.buildUrl(endpoint, options?.baseUrl), {
            headers: this.buildHeaders(options),
            params: this.buildParams(options?.params),
            withCredentials: true,
        }).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }
}