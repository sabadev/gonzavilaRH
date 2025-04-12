import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastController, PopoverController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { PositionService } from 'src/app/services/positions.service';
import { AreaService } from 'src/app/services/area.service';
import { PositionListPopoverComponent } from '../position-list-popover/position-list-popover.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = {
    name: '',
    last_name: '',
    second_last_name: '',
    birth_date: '2000-01-01',
    rfc: '',
    nss: '',
    curp: '',
    position_id: null,
    position_name: '',
    fecha_alta: null,
    fecha_baja: null,
    activo: true,
    base_salary: 0,
    bonuses: 0,
    discounts: 0,
    marital_status: '',
    address: '',
    experience: '',
    education_level: ''
  };

  isSaving = false;
  isEditMode = false;

  constructor(
    private employeesService: EmployeesService,
    private positionService: PositionService,
    private areaService: AreaService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService,
    private popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEditMode = true;
      this.loadEmployee(id);
    }
  }

  async openPositionPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PositionListPopoverComponent,
      event: ev,
      translucent: true,
      size: 'auto',
      cssClass: 'position-popover'
    });

    popover.onDidDismiss().then(({ data }) => {
      if (data?.positionSelected) {
        this.employee.position_id = data.positionSelected.id;
        this.employee.position_name = data.positionSelected.name;
      }
    });

    await popover.present();
  }

  loadEmployee(id: string): void {
    this.employeesService.getEmployeeById(id).subscribe({
      next: (data: any) => {
        this.employee = data;
        this.employee.position_name = data.position?.name || '';
        this.formatDates();
      },
      error: (err: any) => {
        console.error('Error al cargar empleado:', err);
        this.handleLoadError(err);
      },
    });
  }

  private formatDates(): void {
    const formatDate = (dateString: string) => {
      if (!dateString) return null;
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    };

    this.employee.birth_date = formatDate(this.employee.birth_date);
    this.employee.fecha_alta = formatDate(this.employee.fecha_alta);
    this.employee.fecha_baja = formatDate(this.employee.fecha_baja);
  }

  saveEmployee(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isSaving = true;

    if (this.isEditMode) {
      this.updateEmployee();
    } else {
      this.createEmployee();
    }
  }

  private validateForm(): boolean {
    if (!this.employee.name || !this.employee.last_name) {
      this.presentToast('Nombre y apellido paterno son obligatorios', 'danger');
      return false;
    }

    if (!this.employee.curp) {
      this.presentToast('El CURP es obligatorio', 'danger');
      return false;
    }

    if (!this.employee.rfc) {
      this.presentToast('El RFC es obligatorio', 'danger');
      return false;
    }

    if (!this.employee.nss) {
      this.presentToast('El NSS es obligatorio', 'danger');
      return false;
    }

    if (!this.employee.position_id) {
      this.presentToast('Debe seleccionar una posición', 'danger');
      return false;
    }

    return true;
  }

  private updateEmployee(): void {
    this.employeesService.updateEmployee(this.employee.id, this.employee).subscribe({
      next: () => {
        this.presentToast('Empleado actualizado exitosamente');
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.handleSaveError(err);
      },
    });
  }

  private createEmployee(): void {
    this.employeesService.createEmployee(this.employee).subscribe({
      next: (response: any) => {
        const message = `Empleado creado exitosamente`;
        this.presentToast(message);
        this.router.navigate(['/employees']);
      },
      error: (err: any) => {
        this.handleSaveError(err);
      },
    });
  }

  private handleLoadError(error: any): void {
    if (error.status === 401) {
      this.presentToast('Sesión expirada. Por favor ingresa nuevamente', 'danger');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.presentToast('Error al cargar datos del empleado', 'danger');
      this.router.navigate(['/employees']);
    }
  }

  private handleSaveError(error: any): void {
    this.isSaving = false;
    if (error.status === 401) {
      this.presentToast('Sesión expirada. Por favor ingresa nuevamente', 'danger');
      this.authService.logout();
      this.router.navigate(['/login']);
    } else {
      this.presentToast(error.error?.error || 'Error al guardar empleado', 'danger');
    }
  }

  private async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}
