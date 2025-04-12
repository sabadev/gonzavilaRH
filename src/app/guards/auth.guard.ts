import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('token');
    console.log('Token en AuthGuard:', token);

    if (!token || !this.authService.isTokenValid()) {
      console.error('Token inválido o no encontrado. Redirigiendo al login.');
      this.router.navigate(['/login']);
      return false;
    }

    console.log('Token válido. Acceso permitido.');
    return true;
  }
}
