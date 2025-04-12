import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  onLogin(): void {
    if (!this.username || this.username.trim().length < 3 || !this.password) {
      this.presentToast('Usuario y contraseña son obligatorios y deben ser válidos', 'warning');
      return;
    }

    this.isLoading = true;
    console.log('Iniciando sesión con:', this.username, this.password);

    this.authService.login(this.username, this.password).subscribe({
      next: response => {
        this.redirectUserBasedOnRole(); // Redirigir según el rol
      },
      error: err => {
        console.error('Error en login:', err);
        this.presentToast('Error en inicio de sesión', 'danger');
        this.isLoading = false; // Asegúrate de detener el estado de carga
      },
      complete: () => {
        console.log('Completado');
        this.isLoading = false; // Detener el estado de carga al completar
      },
    });
  }

  private redirectUserBasedOnRole(): void {
    console.log('Redirigiendo según el rol del usuario');

    const token = localStorage.getItem('token');
    const employeeId = localStorage.getItem('employeeId');
    if (!token) {
      this.presentToast('Error al autenticar. Intente nuevamente.', 'danger');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role; // Supongamos que `role` está en el payload

      if (!employeeId) {
        console.warn('El employeeId no está almacenado en el localStorage.');
        this.presentToast('Error: No se encontró el ID del empleado. Intente iniciar sesión nuevamente.', 'warning');
        this.authService.logout(); // Limpia cualquier sesión previa
        return;
      }

      if (role === 'admin') {
        this.router.navigate(['/attendance']);
      } else {
        this.router.navigate(['/attendance']);
      }
    } catch (error) {
      console.error('Error al procesar el token:', error);
      this.presentToast('Error al procesar autenticación.', 'danger');
    }
  }


  async presentToast(message: string, color: string = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    toast.present();
  }
}

