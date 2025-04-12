import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastController, AlertController } from '@ionic/angular';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' })),
      ]),
    ]),
  ],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = {};
  fields = [
    { label: 'Nombre', name: 'name', required: true },
    { label: 'Apellido Paterno', name: 'last_name', required: true },
    { label: 'Apellido Materno', name: 'second_last_name', required: false },
    { label: 'Fecha de Nacimiento', name: 'birth_date', required: true, type: 'date' },
    { label: 'RFC', name: 'rfc', required: true },
    { label: 'NSS', name: 'nss', required: true },
    { label: 'CURP', name: 'curp', required: true },
    { label: 'Posición', name: 'position', required: true },
  ];

  constructor(
    private employeesService: EmployeesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string): void {
    this.employeesService.getEmployeeById(id).subscribe({
      next: (data: any) => {
        this.employee = data;

        // Formatear birth_date a formato YYYY-MM-DD
        if (this.employee.birth_date) {
          this.employee.birth_date = new Date(this.employee.birth_date).toISOString().substring(0, 10);
        }

        console.log('Empleado obtenido:', this.employee);
      },
      error: (err: any) => {
        console.error('Error al cargar empleado:', err);
      },
    });
  }

  saveEmployee(): void {
    if (!this.validateFields()) {
      this.presentToast('Por favor, completa todos los campos obligatorios', 'danger');
      return;
    }

    if (this.employee.id) {
      this.employeesService.updateEmployee(this.employee.id, this.employee).subscribe({
        next: () => {
          this.presentToast('Empleado actualizado exitosamente');
          this.router.navigate(['/employees']); // Navegar de regreso a la lista
        },
        error: (err: any) => {
          this.presentToast(err.error?.error || 'Error al actualizar empleado', 'danger');
        },
      });
    } else {
      this.employeesService.createEmployee(this.employee).subscribe({
        next: (response: any) => {
          this.presentToast(
            `Empleado creado exitosamente. Usuario: ${response.username}, Contraseña: ${response.password}`
          );
          this.router.navigate(['/employees']); // Navegar de regreso a la lista
        },
        error: (err: any) => {
          this.presentToast(err.error?.error || 'Error al crear empleado', 'danger');
        },
      });
    }
  }

  async updatePassword(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Actualizar Contraseña',
      inputs: [
        {
          name: 'newPassword',
          type: 'password',
          placeholder: 'Ingresa la nueva contraseña',
        },
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Actualizar',
          handler: (data) => {
            if (!data.newPassword) {
              this.presentToast('Por favor, ingresa una nueva contraseña', 'danger');
              return false;
            }

            this.employeesService.updatePassword(this.employee.id, data.newPassword).subscribe({
              next: () => {
                this.presentToast('Contraseña actualizada exitosamente');
              },
              error: (err: any) => {
                this.presentToast(err.error?.error || 'Error al actualizar contraseña', 'danger');
              },
            });
            return true;
          },
        },
      ],
    });

    await alert.present();
  }


  private validateFields(): boolean {
    return !!this.fields.every((field) => !field.required || !!this.employee[field.name]);
  }

  private async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
    });
    await toast.present();
  }
}
