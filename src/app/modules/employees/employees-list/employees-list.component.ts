import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';

  constructor(
    private employeesService: EmployeesService,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  /**
   * Cargar todos los empleados.
   */
  loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.filteredEmployees = [...this.employees];
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
      },
    });
  }

  /**
   * Filtrar empleados por el término de búsqueda.
   */
  filterEmployees(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) => {
      const fullName = `${employee.name} ${employee.last_name || ''} ${employee.second_last_name || ''}`;
      return (
        fullName.toLowerCase().includes(searchValue) ||
        (employee.username || '').toLowerCase().includes(searchValue)
      );
    });
  }

  /**
   * Navegar al componente para agregar un nuevo empleado.
   */
  addEmployee(): void {
    this.router.navigate(['/employees/detail']);
  }

  /**
   * Navegar al componente para editar un empleado existente.
   */
  editEmployee(employeeId: string): void {
    this.router.navigate(['/employees/detail', employeeId]);
  }

  /**
   * Mostrar los archivos de un empleado.
   */
  viewFiles(employeeId: string): void {
    this.router.navigate(['/employees/files', employeeId]);
  }

  /**
   * Confirmar eliminación de un empleado.
   */
  async confirmDelete(employee: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar a ${employee.name}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          handler: () => this.deleteEmployee(employee.id),
        },
      ],
    });

    await alert.present();
  }

  /**
   * Eliminar un empleado.
   */
  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => {
        this.presentToast('Empleado eliminado exitosamente.');
        this.loadEmployees();
      },
      error: (err) => {
        console.error('Error al eliminar empleado:', err);
        this.presentToast('Error al eliminar empleado.', 'danger');
      },
    });
  }

  /**
   * Mostrar notificaciones tipo toast.
   */
  private async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
    });
    await toast.present();
  }
}
