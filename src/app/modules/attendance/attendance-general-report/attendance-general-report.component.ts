import { Component } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-attendance-general-report',
  templateUrl: './attendance-general-report.component.html',
  styleUrls: ['./attendance-general-report.component.scss'],
  standalone: false, // Define el componente como independientendalone: fals, // Define el componente como independientendalone: false, // Define el componente como independiente
})
export class AttendanceGeneralReportComponent {
  startDate: string | null = null;
  endDate: string | null = null;
  attendanceReport: any[] = [];
  hoursReport: any[] = [];
  isLoading = false;

  constructor(private attendanceService: AttendanceService) {}

  getDaysInRange(startDate: string, endDate: string): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: string[] = [];
    while (start <= end) {
      days.push(new Date(start).toISOString().split('T')[0]);
      start.setDate(start.getDate() + 1);
    }
    return days;
  }

  async getAttendanceReport() {
    if (!this.validateDates()) return;

    this.isLoading = true;
    try {
      const data = await this.attendanceService
        .getGeneralReport(this.startDate!, this.endDate!)
        .toPromise();

      const daysInRange = this.getDaysInRange(this.startDate!, this.endDate!);
      this.attendanceReport = data.map((employee: any) => ({
        ...employee,
        dailyAttendance: daysInRange.map((day) => ({
          date: day,
          status: employee.dailyAttendance[day] || '❌',
        })),
      }));
    } catch (error) {
      console.error('Error:', error);
      this.showErrorToast('Error al generar el reporte');
    } finally {
      this.isLoading = false;
    }
  }

  private validateDates(): boolean {
    if (!this.startDate || !this.endDate) {
      this.showErrorToast('Seleccione ambas fechas');
      return false;
    }

    const start = new Date(this.startDate);
    const end = new Date(this.endDate);

    if (start > end) {
      this.showErrorToast('La fecha inicial no puede ser mayor a la final');
      return false;
    }

    return true;
  }

  private showErrorToast(message: string) {
    // Implementar lógica de toast aquí
    console.warn('Error:', message);
  }

  getHoursReport(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor selecciona una fecha válida.');
      return;
    }
    this.attendanceService.getGeneralReportInOut(this.startDate, this.endDate).subscribe({
      next: (data) => {
        const daysInRange = this.getDaysInRange(this.startDate!, this.endDate!);
        this.hoursReport = data.map((employee: any) => {
          const dailyAttendance = daysInRange.map((day) => ({
            date: day,
            first_entry: employee.dailyAttendance[day]?.first_entry || 'N/A',
            last_exit: employee.dailyAttendance[day]?.last_exit || 'N/A',
          }));
          return {
            ...employee,
            dailyAttendance,
          };
        });
      },
      error: (err) => console.error('Error al generar reporte de horarios:', err),
    });
  }

  exportAttendanceToExcel(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor selecciona una fecha válida.');
      return;
    }
    const wsData: any[] = [];
    const headers = ['Empleado', ...this.getDaysInRange(this.startDate, this.endDate), 'Días Asistidos', 'Días No Asistidos'];
    wsData.push(headers);

    this.attendanceReport.forEach((employee) => {
      const row = [employee.full_name];
      employee.dailyAttendance.forEach((day: { date: string; status: string }) => {
        row.push(day.status);
      });
      row.push(employee.attendedDays, employee.missedDays);
      wsData.push(row);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencias');
    XLSX.writeFile(wb, `Reporte_Asistencias_${this.startDate}_${this.endDate}.xlsx`);
  }

  exportHoursToExcel(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor selecciona una fecha válida.');
      return;
    }
    const wsData: any[] = [];
    const headers = ['Empleado', ...this.getDaysInRange(this.startDate, this.endDate)];
    wsData.push(headers);

    this.hoursReport.forEach((employee) => {
      const row = [employee.full_name];
      employee.dailyAttendance.forEach((day: { date: string; first_entry: string; last_exit: string }) => {
        row.push(`Entrada: ${day.first_entry} / Salida: ${day.last_exit}`);
      });
      wsData.push(row);
    });

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(wsData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Horarios');
    XLSX.writeFile(wb, `Reporte_Horarios_${this.startDate}_${this.endDate}.xlsx`);
  }
}
