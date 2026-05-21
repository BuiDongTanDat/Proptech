import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { catchError, Observable, throwError, timeout } from "rxjs";
import { environment } from "../../../environments/environment.development";

export interface ApiOptions {
    params?: Record<string, any>;
    token?: string;
    baseUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private apiUrl = environment.defaultUrl || ''; // Lấy domain từ environment
    private readonly DEFAULT_TIMEOUT = 30000;

    constructor(private http: HttpClient) { }
    // Build URL 
    private buildUrl(endpoint: string, baseUrl?: string): string {
        if (endpoint.startsWith('http')) return endpoint;
        const base = baseUrl ?? this.apiUrl;
        return `${base}/${endpoint.replace(/^\//, '')}`;
    }

    //Create header 
    private buildHeaders(
        token?: string,
        isFormData: boolean = false
    ): HttpHeaders {
        let headers = new HttpHeaders();

        // Bearer token nếu có
        if (token) {
            headers = headers.set('Authorization', `Bearer ${token}`);
        }

        // Content-Type cho form data
        if (isFormData) {
            headers = headers.set('Content-Type', 'multipart/form-data');
        }
        return headers;
    }

    private buildParams(params?: Record<string, any>): HttpParams {
        let httpParams = new HttpParams();
        if (params) {
            Object.keys(params).forEach(key => {
                const value = params[key];
                if (value !== null && value !== undefined) {
                    httpParams = httpParams.set(key, value.toString());
                }
            });
        }
        return httpParams;
    }

    //Error Handler 
    private handleError(error: any): Observable<never> {
        console.error('[ApiService]', error);

        const message =
            error?.error?.message ||
            error?.message ||
            'Có lỗi xảy ra';

        return throwError(() => ({
            status: error?.status,
            message: message,
            raw: error
        }));
    }

    //  GET 
    get<T>(
        endpoint: string,
        options?: ApiOptions
    ): Observable<T> {

        return this.http.get<T>(
            this.buildUrl(endpoint, options?.baseUrl),
            {
                headers: this.buildHeaders(options?.token),
                params: this.buildParams(options?.params),
                withCredentials: true,
            }
        ).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    //  POST JSON 
    post<T>(
        endpoint: string,
        body: unknown,
        options?: ApiOptions
    ): Observable<T> {

        return this.http.post<T>(
            this.buildUrl(endpoint, options?.baseUrl),
            body,
            {
                headers: this.buildHeaders(options?.token),
                withCredentials: true,
            }
        ).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    // POST FormData 
    postFormData<T>(
        endpoint: string,
        formData: FormData,
        options?: ApiOptions
    ): Observable<T> {
        return this.http.post<T>(
            this.buildUrl(endpoint, options?.baseUrl),
            formData,
            {
                headers: this.buildHeaders(options?.token, true),
                withCredentials: true,
            }
        ).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    //PUT 
    put<T>(
        endpoint: string,
        body: unknown,
        options?: ApiOptions
    ): Observable<T> {

        return this.http.put<T>(
            this.buildUrl(endpoint, options?.baseUrl),
            body,
            {
                headers: this.buildHeaders(options?.token),
                withCredentials: true,
            }
        ).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    //  PATCH
    patch<T>(
        endpoint: string,
        body: unknown,
        options?: ApiOptions
    ): Observable<T> {
        return this.http.patch<T>(
            this.buildUrl(endpoint, options?.baseUrl),
            body,
            {
                headers: this.buildHeaders(options?.token),
                withCredentials: true,
            }
        ).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }

    // DELETE 
    delete<T>(
        endpoint: string,
        options?: ApiOptions
    ): Observable<T> {

        return this.http.delete<T>(
            this.buildUrl(endpoint, options?.baseUrl),
            {
                headers: this.buildHeaders(options?.token),
                withCredentials: true,
            }
        ).pipe(
            timeout(this.DEFAULT_TIMEOUT),
            catchError(err => this.handleError(err))
        );
    }


}