import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import {
  catchError,
  filter,
  switchMap,
  take,
  finalize,
  retry,
} from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';

const PUBLIC_URLS = [
  '/login',
  '/request-reset-password',
  '/reset-password',
  '/setup',
  '/refresh',
];

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Vì token nằm trong cookie nên chỉ cần gửi credentials
  // HttpRequest là immutable (không sửa trực tiếp được), nên phải clone.
  const authReq = req.clone({
    withCredentials: true,
  });

  // Nếu request này là request công khai (không cần token) 
  // thì không cần xử lý refresh token
  const isPublicRequest = PUBLIC_URLS.some((url) =>
    req.url.includes(url)
  );

  // API public -> không xử lý refresh logic
  if (isPublicRequest) {
    return next(authReq);
  }

  // Gửi request bình thường, nếu có lỗi 401 thì mới xử lý refresh token
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // Nếu không phải 401 thì trả lỗi luôn
      if (error.status !== 401) {
        return throwError(() => error);
      }

      // Không refresh nếu chính nó là refresh-token request
      if (req.url.includes('refresh')) {
        authService.logout(); // hoặc redirect login
        return throwError(() => error);
      }

      // Nếu đang refresh rồi thì các request khác chờ
      if (isRefreshing) {
        // Các request đang chờ được đưa vào hàng đợi,
        //  khi refresh xong sẽ được thông báo để retry
        return refreshSubject.pipe(
          filter((done) => done),
          take(1), // chỉ nhận 1 lần tín hiệu rồi unsubscribe
          switchMap(() => next(authReq))
        );
      }

      // Bắt đầu refresh
      isRefreshing = true;
      refreshSubject.next(false); // thông báo hệ thống đang bận.

      //Call API refresh token
      return authService.refreshToken().pipe(
        retry(2), // thử lại 2 lần nếu refresh token fail
        switchMap(() => {
          // refresh thành công -> retry request cũ
          refreshSubject.next(true); // thông báo hệ thống đã xong.
          return next(authReq); // retry request cũ
        }),

        catchError((refreshError) => {
          // refresh thất bại -> logout
          // Thông báo lỗi cho các request đang chờ là refresh fail, không chờ nữa
          refreshSubject.error(refreshError);
          authService.logout();
          return throwError(() => refreshError);
        }),

        finalize(() => {
          isRefreshing = false;
        })
      );
    })
  );
};