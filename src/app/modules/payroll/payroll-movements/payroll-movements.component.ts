import { Component, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payroll-movements',
  templateUrl: './payroll-movements.component.html',
  styleUrls: ['./payroll-movements.component.scss'],
})
export class PayrollMovementsComponent implements OnInit {
  employeeId: string = '';
  employee: any = {}; // Detalles del empleado
  adjustments: any[] = []; // Ejemplo de ajustes de nómina

  constructor(
    private employeesService: EmployeesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEmployeeDetails();
  }

  loadEmployeeDetails(): void {
    this.employeesService.getEmployeeById(this.employeeId).subscribe({
      next: (data: any) => {
        this.employee = data; // Asignar los detalles del empleado
      },
      error: (error: any) => {
        console.error('Error al cargar los detalles del empleado:', error);
      },
    });
  }

// In your saveAdjustments method in the component
saveAdjustments(): void {
  if (!this.adjustments.length) {  // Make sure this matches your property name
    console.error('No hay ajustes para guardar');
    return;
  }

  this.employeesService.saveAdjustments(this.employeeId, this.adjustments).subscribe({
    next: () => {
      console.log('Ajustes guardados exitosamente');
      // You might want to add user feedback here (toast, alert, etc.)
    },
    error: (error: any) => {
      console.error('Error al guardar ajustes:', error);
      // Add error handling for the user
    },
  });
}

  goBack(): void {
    window.history.back(); // Navegar a la página anterior
  }
}
