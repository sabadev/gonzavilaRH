import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
    });
  }

  



 

async onLogin(): Promise<void> {
  if (this.loginForm.invalid) {
    this.presentToast('Por favor, completa el formulario correctamente.', 'warning');
    return;
  }

  this.isLoading = true;
  const { username, password } = this.loginForm.value;

  try {
    const response = await this.authService.login(username, password).toPromise();
    this.presentToast('Inicio de sesión exitoso', 'success'); // Mensaje de éxito
    this.redirectUserBasedOnRole();
  } catch (error) {
    console.error('Error en login:', error);

    // Verificar si el error es de tipo HttpErrorResponse
    if (error instanceof HttpErrorResponse && error.error && error.error.error) {
      this.presentToast(error.error.error, 'danger');
    } else {
      this.presentToast('Error en inicio de sesión. Inténtalo de nuevo.', 'danger');
    }
  } finally {
    this.isLoading = false;
  }
}

  private async redirectUserBasedOnRole(): Promise<void> {
    const role = this.authService.getRoleFromToken();
    if (role === 'admin') {
      await this.router.navigate(['/attendance']);
    } else if (role === 'employee') {
      await this.router.navigate(['/attendance']);
    } else {
      await this.router.navigate(['/home']);
    }
    window.location.reload(); // Recargar la página para reiniciar el estado
  }

  async presentToast(message: string, color: string = 'danger'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}