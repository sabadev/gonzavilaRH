import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs'; // Importa Observable y throwError
import { catchError, tap } from 'rxjs/operators'; // Importa catchError y tap
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;
  private authState = new BehaviorSubject<boolean>(this.isAuthenticated());

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/auth`;
  }

  login(username: string, password: string): Observable<{ token: string; employeeId?: number }> {
    return this.http.post<{ token: string; employeeId?: number }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response) => {
        if (response.token) {
          localStorage.setItem('token', response.token); // Guardar el token
          if (response.employeeId) {
            localStorage.setItem('employeeId', response.employeeId.toString()); // Guardar el employeeId
          }
          this.authState.next(true); // Actualizar el estado de autenticación
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
    const token = localStorage.getItem('token');
    return token ? this.isTokenValid(token) : false;
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
    const token = localStorage.getItem('token');
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
