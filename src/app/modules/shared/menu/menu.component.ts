import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {}

  async logout(): Promise<void> {
    const alert = document.createElement('ion-alert');
    alert.header = 'Cerrar Sesión';
    alert.message = '¿Estás seguro de que deseas salir?';
    alert.buttons = [
      {
        text: 'Cancelar',
        role: 'cancel',
      },
      {
        text: 'Cerrar Sesión',
        handler: () => {
          this.authService.logout();
          this.router.navigate(['/login']);
        },
      },
    ];
    document.body.appendChild(alert);
    await alert.present();
  }
}
