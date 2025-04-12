import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;
  private apiUrl2: string;
  private authState = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/auth`;
    this.apiUrl2 = `${this.configService.apiUrl}/employees`;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  changePassword(newPassword: string): Observable<any> {
    const employeeId = this.getEmployeeId();
    if (!employeeId) {
      return throwError(() => new Error('No se pudo obtener el ID del empleado'));
    }

    return this.http.put(
      `${this.apiUrl2}/update-password/${employeeId}`,
      { newPassword }, // Enviar solo newPassword como requiere el backend
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError((error) => {
        console.error('Error al cambiar contraseña:', error);
        return throwError(() => new Error(error.error?.error || 'Error al cambiar contraseña'));
      })
    );
  }

  login(username: string, password: string): Observable<{ token: string; employeeId?: number }> {
    return this.http.post<{ token: string; employeeId?: number }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          if (response.employeeId) {
            localStorage.setItem('employeeId', response.employeeId.toString());
          }
          this.authState.next(true);
        }
      }),
      catchError((error) => {
        console.error('Error en el inicio de sesión:', error);
        return throwError(() => new Error('Credenciales inválidas o error en el servidor.'));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
    this.authState.next(false);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token ? this.isTokenValid(token) : false;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  checkUsernameExists(username: string): Observable<boolean> {
    return this.http.post<boolean>('/api/check-username', { username });
  }

  private isTokenValid(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      console.error('Error al validar el token:', error);
      return false;
    }
  }

  getRoleFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  getEmployeeId(): number | null {
    const employeeId = localStorage.getItem('employeeId');
    return employeeId && !isNaN(Number(employeeId)) ? Number(employeeId) : null;
  }

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }
}
