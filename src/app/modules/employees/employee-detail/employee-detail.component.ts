import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';
import { PositionService } from 'src/app/services/positions.service';
import { ToastController, AlertController, ModalController, PopoverController } from '@ionic/angular';
import { AddPositionModalComponent } from '../add-position-modal/add-position-modal.component';
import { PositionListPopoverComponent } from '../position-list-popover/position-list-popover.component';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.scss'],
})
export class EmployeeDetailComponent implements OnInit {
  employee: any = {
    position_id: null,
    position_name: '',
  };

  positions: any[] = []; // Lista completa de posiciones
  filteredPositions: any[] = []; // Lista filtrada de posiciones

  fields = [
    { label: 'Nombre', name: 'name', required: true },
    { label: 'Apellido Paterno', name: 'last_name', required: true },
    { label: 'Apellido Materno', name: 'second_last_name', required: false },
    { label: 'Fecha de Nacimiento', name: 'birth_date', required: true, type: 'date' },
    { label: 'RFC', name: 'rfc', required: true },
    { label: 'NSS', name: 'nss', required: true },
    { label: 'CURP', name: 'curp', required: true },
    { label: 'Posición', name: 'position_id', required: true },
    { label: 'Fecha de Alta', name: 'fecha_alta', required: false, type: 'date' },
    { label: 'Fecha de Baja', name: 'fecha_baja', required: false, type: 'date' },
    { label: 'Activo', name: 'activo', required: false, type: 'checkbox' },
  ];

  constructor(
    private employeesService: EmployeesService,
    private positionService: PositionService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController,
    private popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
    this.loadPositions(); // Cargar las posiciones al iniciar
  }



// Abrir popover para seleccionar posición
async openPositionPopover(ev: any) {
  const popover = await this.popoverController.create({
    component: PositionListPopoverComponent,
    event: ev,
    translucent: true,
  });

  await popover.present();

  // Escuchar el evento de cierre del popover
  const { data } = await popover.onDidDismiss();
  if (data?.positionSelected) {
    this.employee.position_id = data.positionSelected.id; // Actualizar el ID de la posición
    this.employee.position_name = data.positionSelected.name; // Actualizar el nombre de la posición
  }
}

  // Seleccionar una posición
  selectPosition(position: any): void {
    this.employee.position_id = position.id;
    this.employee.position_name = position.name;
  }

  // Cargar las posiciones
  loadPositions(): void {
    this.positionService.searchPositions().subscribe({
      next: (positions: any[]) => {
        this.positions = positions;
        this.filteredPositions = positions; // Inicialmente, mostrar todas las posiciones
      },
      error: (err: any) => {
        console.error('Error al cargar posiciones:', err);
      },
    });
  }

  // Filtrar posiciones según el término de búsqueda
  filterPositions(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredPositions = this.positions.filter((position) =>
      position.name.toLowerCase().includes(searchTerm)
    );
  }

  // Manejar la posición seleccionada
  onPositionSelected(event: any): void {
    const selectedPosition = this.positions.find((p) => p.id === event.detail.value);
    if (selectedPosition) {
      this.employee.position_name = selectedPosition.name;
    }
  }

  // Abrir modal para agregar una nueva posición
  async openAddPositionModal(event: Event): Promise<void> {
    event.stopPropagation(); // Evitar que el ion-select se cierre

    const modal = await this.modalController.create({
      component: AddPositionModalComponent,
    });

    await modal.present();

    // Actualizar la lista de posiciones después de cerrar el modal
    const { data } = await modal.onDidDismiss();
    if (data?.newPosition) {
      this.loadPositions(); // Recargar las posiciones
    }
  }

  // Cargar los datos del empleado
  loadEmployee(id: string): void {
    this.employeesService.getEmployeeById(id).subscribe({
      next: (data: any) => {
        this.employee = data;

        // Formatear fechas si existen
        if (this.employee.birth_date) {
          this.employee.birth_date = new Date(this.employee.birth_date).toISOString().substring(0, 10);
        }
        if (this.employee.fecha_alta) {
          this.employee.fecha_alta = new Date(this.employee.fecha_alta).toISOString().substring(0, 10);
        }
        if (this.employee.fecha_baja) {
          this.employee.fecha_baja = new Date(this.employee.fecha_baja).toISOString().substring(0, 10);
        }

        console.log('Empleado obtenido:', this.employee);
      },
      error: (err: any) => {
        console.error('Error al cargar empleado:', err);
      },
    });
  }

  // Guardar empleado
  saveEmployee(): void {
    if (!this.validateFields()) {
      this.presentToast('Por favor, completa todos los campos obligatorios', 'danger');
      return;
    }

    if (this.employee.id) {
      // Actualizar empleado existente
      this.employeesService.updateEmployee(this.employee.id, this.employee).subscribe({
        next: () => {
          this.presentToast('Empleado actualizado exitosamente');
          this.router.navigate(['/employees']);
        },
        error: (err: any) => {
          this.presentToast(err.error?.error || 'Error al actualizar empleado', 'danger');
        },
      });
    } else {
      // Crear nuevo empleado
      this.employeesService.createEmployee(this.employee).subscribe({
        next: (response: any) => {
          this.presentToast(
            `Empleado creado exitosamente. Usuario: ${response.username}, Contraseña: ${response.password}`
          );
          this.router.navigate(['/employees']);
        },
        error: (err: any) => {
          this.presentToast(err.error?.error || 'Error al crear empleado', 'danger');
        },
      });
    }
  }

  // Actualizar contraseña
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

  // Validar campos obligatorios
  private validateFields(): boolean {
    return this.fields.every((field) => !field.required || !!this.employee[field.name]);
  }

  // Mostrar un toast
  private async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
    });
    await toast.present();
  }
}