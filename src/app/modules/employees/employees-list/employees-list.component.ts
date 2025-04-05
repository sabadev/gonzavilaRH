import { Component, OnInit } from '@angular/core';
import {
  trigger,
  style,
  transition,
  animate,
  query,
  stagger,
  group,
} from '@angular/animations';
import { EmployeesService } from 'src/app/services/employees.service';
import { AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.8)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' })),
      ]),
    ]),
    trigger('viewChangeAnimation', [
      transition('list => grid', [
        group([
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'scale(0.8)' }),
              stagger(50, animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))),
            ],
            { optional: true }
          ),
        ]),
      ]),
      transition('grid => list', [
        group([
          query(
            ':enter',
            [
              style({ opacity: 0, transform: 'translateY(-20px)' }),
              stagger(50, animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))),
            ],
            { optional: true }
          ),
        ]),
      ]),
    ]),
  ],
})
export class EmployeesListComponent implements OnInit {
  employees: any[] = [];
  filteredEmployees: any[] = [];
  searchTerm: string = '';
  viewMode: 'list' | 'grid' = 'list'; // Default view

  constructor(
    private employeesService: EmployeesService,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
    this.route.params.subscribe(() => {
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data.filter((employee) => employee.username);
        this.filteredEmployees = [...this.employees];
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
      },
    });
  }

  filterEmployees(event: any): void {
    const searchValue = event.target.value.toLowerCase();
    this.filteredEmployees = this.employees.filter((employee) => {
      const fullName = `${employee.name} ${employee.last_name || ''} ${employee.second_last_name || ''}`;
      return (
        fullName.toLowerCase().includes(searchValue) ||
        (employee.position || '').toLowerCase().includes(searchValue) ||
        (employee.username || '').toLowerCase().includes(searchValue)
      );
    });
  }

  onViewModeChange(event: any): void {
    this.viewMode = event.detail.value;
  }

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

  deleteEmployee(id: string): void {
    this.employeesService.deleteEmployee(id).subscribe({
      next: () => this.loadEmployees(),
      error: (error) => console.error('Error al eliminar empleado:', error),
    });
  }
}
