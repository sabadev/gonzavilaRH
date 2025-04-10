import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 < Date.now()) {
          console.warn('El token ha expirado.');
          this.handleExpiredToken();
          return throwError(() => new Error('Token expirado.'));
        }

        const clonedRequest = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
        return next.handle(clonedRequest);
      } catch (error) {
        console.error('Error al procesar el token:', error);
        this.handleExpiredToken();
        return throwError(() => new Error('Error al procesar el token.'));
      }
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (err.status === 401 || err.status === 403) {
          console.warn('Acceso denegado: No autorizado.');
          this.handleUnauthorized();
        }
        return throwError(() => err);
      })
    );
  }

  private handleExpiredToken(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    this.router.navigate(['/login']);
  }

  private handleUnauthorized(): void {
    this.router.navigate(['/login']);
  }
}
