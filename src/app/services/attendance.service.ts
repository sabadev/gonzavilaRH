import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError as observableThrowError, throwError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/attendance`;
  }

  getEmployees(): Observable<any> {
    console.log('Llamando a getEmployees...');
    return this.http.get(`${this.apiUrl}/employees`).pipe(
      catchError(this.handleError)
    );
  }

  // Obtener logs recientes del usuario autenticado
  getRecentLogs(employeeId: number): Observable<any> {
    console.log(`Llamando a getRecentLogs con employeeId: ${employeeId}`);
    return this.http.get(`${this.apiUrl}/logs/recent?employee_id=${employeeId}`).pipe(
      catchError(this.handleError)
    );
  }


  // Registrar entrada/salida para el usuario autenticado
  registerLog(log: { employee_id: number; log_type: string }): Observable<any> {
    console.log('Llamando a registerLog con los datos:', log);
    return this.http.post(`${this.apiUrl}/logs`, log).pipe(
      catchError(this.handleError)
    );
  }

  getAttendanceByEmployee(employeeId: number, startDate: string, endDate: string): Observable<any> {
    console.log(
      `Llamando a getAttendanceByEmployee con employeeId: ${employeeId}, startDate: ${startDate}, endDate: ${endDate}`
    );
    return this.http
      .get(`${this.apiUrl}/employee`, {
        params: {
          employee_id: employeeId.toString(),
          start_date: startDate,
          end_date: endDate,
        },
      })
      .pipe(catchError(this.handleError));
  }

  getGeneralReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/general`, {
      params: { start_date: startDate, end_date: endDate }, // Cambiar los nombres si es necesario
    }).pipe(
      catchError(this.handleError)
    );
  }

  getGeneralReportInOut(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/generalinout`, {
      params: { start_date: startDate, end_date: endDate }, // Cambiar los nombres si es necesario
    }).pipe(
      catchError(this.handleError)
    );
  }

  registerLogWithPhoto(formData: FormData): Observable<any> {
    console.log('Llamando a registerLogWithPhoto con FormData:', {
      employee_id: formData.get('employee_id'),
      log_type: formData.get('log_type'),
      photo: formData.get('photo'),
    });
    return this.http.post(`${this.apiUrl}/logs/photo`, formData).pipe(
      catchError((error) => {
        console.error('Error en el servicio:', error);
        return throwError(() => new Error('Error inesperado. Por favor, inténtelo de nuevo más tarde.'));
      })
    );
  }

  private handleError(error: any): Observable<never> {
    const errorMessage = error.error?.message || 'Error inesperado. Por favor, inténtelo de nuevo más tarde.';
    console.error('Error en el servicio:', errorMessage);
    return customThrowError(errorMessage);
  }
}

function customThrowError(message: string): Observable<never> {
  console.log('Lanzando error personalizado:', message);
  return observableThrowError(() => new Error(message));
}
