import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/auth`;
  }

  login(username: string, password: string): Observable<{ token: string; employeeId?: number }> {
    return this.http.post<{ token: string; employeeId?: number }>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        console.log('Respuesta del servidor en login:', response);

        if (response.token) {
          localStorage.setItem('token', response.token);
          console.log('Token guardado en localStorage.');
        } else {
          console.error('El servidor no devolvió un token válido.');
        }

        if (response.employeeId !== undefined && response.employeeId !== null) {
          localStorage.setItem('employeeId', response.employeeId.toString());
          console.log('EmployeeId guardado en localStorage:', response.employeeId);
        } else {
          console.warn('El servidor devolvió un employeeId vacío o nulo.');
          localStorage.removeItem('employeeId');
        }
      }),
      catchError(error => {
        console.error('Error en el inicio de sesión:', error);
        return throwError(() => new Error('Credenciales inválidas o error en el servidor.'));
      })
    );
  }



  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

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

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('employeeId');
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private storeEmployeeId(employeeId: number): void {
    localStorage.setItem('employeeId', employeeId.toString());
  }

    // Método para verificar si el usuario está autenticado
    isAuthenticated(): boolean {
      const token = localStorage.getItem('token');
      if (!token) return false;

      try {
        const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el token JWT
        return payload.exp * 1000 > Date.now(); // Verificar si el token ha expirado
      } catch (error) {
        console.error('Token inválido o malformado:', error);
        return false;
      }
    }
}
