import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  isLoading = true;
  searchTerm = '';
  private subscriptions = new Subscription();

  constructor(
    private employeesService: EmployeesService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private subscribeToUpdates(): void {
    this.subscriptions.add(
      this.employeesService.refresh$.subscribe(() => {
        this.loadEmployees();
      })
    );
  }

  loadEmployees(): void {
    this.isLoading = true;
    this.subscriptions.add(
      this.employeesService.employees$.subscribe({
        next: (employees) => {
          this.employees = employees;
          this.filterEmployees();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading employees:', error);
          this.isLoading = false;
          this.handleLoadingError(error);
        }
      })
    );
  }

  private handleLoadingError(error: any): void {
    if (error.status === 401) {
      this.showSessionExpiredAlert();
    } else {
      this.showErrorAlert();
    }
  }

  filterEmployees(): void {
    if (!this.searchTerm) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee =>
      employee.name.toLowerCase().includes(term) ||
      employee.last_name.toLowerCase().includes(term) ||
      employee.position?.toLowerCase().includes(term) ||
      employee.area?.toLowerCase().includes(term)
    );
  }

  private async showErrorAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo cargar la lista de empleados',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSessionExpiredAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Sesión Expirada',
      message: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
      buttons: ['OK']
    });
    await alert.present();
    this.authService.logout();
  }

  editEmployee(id: string): void {
    this.router.navigate(['/employees/detail', id]);
  }

  createEmployee(): void {
    this.router.navigate(['/employees/detail/new']);
  }

  async confirmDelete(employee: any): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: `¿Estás seguro de eliminar a ${employee.name} ${employee.last_name}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteEmployee(employee.id);
          }
        }
      ]
    });
    await alert.present();
  }

  private deleteEmployee(id: string): void {
    this.subscriptions.add(
      this.employeesService.deleteEmployee(id).subscribe({
        next: () => {
          // La actualización se manejará mediante refresh$
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
          this.showDeleteErrorAlert();
        }
      })
    );
  }

  private async showDeleteErrorAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'No se pudo eliminar el empleado',
      buttons: ['OK']
    });
    await alert.present();
  }
}
