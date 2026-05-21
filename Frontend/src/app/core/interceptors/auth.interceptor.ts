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
} from 'rxjs/operators';

import { AuthService } from '../services/auth/auth.service';

let isRefreshing = false;
const refreshSubject = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  // Vì token nằm trong cookie nên chỉ cần gửi credentials
  const authReq = req.clone({
    withCredentials: true,
  });

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
        return refreshSubject.pipe(
          filter((done) => done),
          take(1),
          switchMap(() => next(authReq))
        );
      }

      // Bắt đầu refresh
      isRefreshing = true;
      refreshSubject.next(false);

      return authService.refreshToken().pipe(
        switchMap(() => {
          // refresh thành công -> retry request cũ
          refreshSubject.next(true);
          return next(authReq);
        }),

        catchError((refreshError) => {
          // refresh fail -> logout
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