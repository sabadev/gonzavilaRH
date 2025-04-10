import { Component, OnInit } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employee-attendance-report',
  templateUrl: './employee-attendance-report.component.html',
  styleUrls: ['./employee-attendance-report.component.scss'],
})
export class EmployeeAttendanceReportComponent implements OnInit {
  employees: any[] = [];
  selectedEmployee: any = null;
  startDate: string = '';
  endDate: string = '';
  showEntries: boolean = true;
  showExits: boolean = true;
  report: any[] = [];

  constructor(
    private attendanceService: AttendanceService,
    private employeesService: EmployeesService
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeesService.getEmployees().subscribe({
      next: (data) => (this.employees = data),
      error: (err) => console.error('Error al cargar empleados:', err),
    });
  }

  // Método compareWith para comparar objetos en ion-select
  compareWith = (o1: any, o2: any): boolean => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  generateReport(): void {
    if (!this.selectedEmployee || !this.startDate || !this.endDate) {
      alert('Por favor selecciona un empleado y un rango de fechas.');
      return;
    }

    this.attendanceService
      .getAttendanceByEmployee(
        this.selectedEmployee.id,
        this.startDate,
        this.endDate
      )
      .subscribe({
        next: (data) => {
          this.report = data.filter((log: { log_type: string }) => {
            if (this.showEntries && this.showExits) return true;
            if (this.showEntries && log.log_type === 'entry') return true;
            if (this.showExits && log.log_type === 'exit') return true;
            return false;
          });
        },
        error: (err) => console.error('Error al generar reporte:', err),
      });
  }
}
