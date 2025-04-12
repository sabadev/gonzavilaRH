import { Component } from '@angular/core';
import { AttendanceService } from 'src/app/services/attendance.service';

@Component({
  selector: 'app-attendance-general-report',
  templateUrl: './attendance-general-report.component.html',
  styleUrls: ['./attendance-general-report.component.scss'],
})
export class AttendanceGeneralReportComponent {
  startDate: string = '';
  endDate: string = '';
  report: any[] = [];

  constructor(private attendanceService: AttendanceService) {}

  // Obtener días dentro del rango
  getDaysInRange(startDate: string, endDate: string): string[] {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days: string[] = [];

    while (start <= end) {
      days.push(new Date(start).toISOString().split('T')[0]); // Formato YYYY-MM-DD
      start.setDate(start.getDate() + 1); // Incrementar día
    }

    return days;
  }

  // Cambiar fecha de inicio y calcular fecha de fin
  onStartDateChange(): void {
    const selectedDate = new Date(this.startDate);

    // Validar que la fecha de inicio sea un jueves
    const dayOfWeek = selectedDate.getUTCDay();
    if (dayOfWeek !== 4) {
      alert('Por favor selecciona un día Jueves como fecha inicial.');
      this.startDate = '';
      this.endDate = '';
      return;
    }

    // Calcular fecha de fin automáticamente (miércoles siguiente)
    const endDate = new Date(selectedDate);
    endDate.setDate(endDate.getDate() + 6);
    this.endDate = endDate.toISOString().split('T')[0];
  }

  // Generar el reporte
  getReport(): void {
    if (!this.startDate || !this.endDate) {
      alert('Por favor selecciona una fecha inicial válida.');
      return;
    }

    this.attendanceService.getGeneralReport(this.startDate, this.endDate).subscribe({
      next: (data) => {
        const daysInRange = this.getDaysInRange(this.startDate, this.endDate);

        this.report = data.map((employee: any) => {
          const dailyAttendance = daysInRange.map((day) => {
            const log = employee.dailyAttendance[day];
            return log
              ? { date: day, entry_time: log.entry_time || 'N/A', exit_time: log.exit_time || 'N/A' }
              : { date: day, entry_time: 'No asistió', exit_time: 'No asistió' };
          });

          return {
            ...employee,
            dailyAttendance,
            attendedDays: dailyAttendance.filter((d) => d.entry_time !== 'No asistió').length,
            missedDays: dailyAttendance.filter((d) => d.entry_time === 'No asistió').length,
          };
        });
      },
      error: (err) => console.error('Error al generar reporte:', err),
    });
  }
}
