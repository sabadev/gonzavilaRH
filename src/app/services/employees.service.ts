import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private apiUrl: string;
  private employeesSubject = new BehaviorSubject<any[]>([]);
  employees$ = this.employeesSubject.asObservable();
  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private http: HttpClient,
    private configService: ConfigService,
    private authService: AuthService
  ) {
    this.apiUrl = `${this.configService.apiUrl}/employees`;
    this.loadInitialData();
  }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Métodos básicos de empleados
  private loadInitialData(): void {
    this.getEmployees().subscribe();
  }

  getEmployees(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getAuthHeaders() }).pipe(
      tap(employees => this.employeesSubject.next(employees)),
      catchError(error => {
        console.error('Error loading employees:', error);
        return throwError(error);
      })
    );
  }

  getEmployeeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error(`Error getting employee ${id}:`, error);
        return throwError(error);
      })
    );
  }

  createEmployee(employeeData: any): Observable<any> {
    return this.http.post(this.apiUrl, employeeData, { headers: this.getAuthHeaders() }).pipe(
      tap(newEmployee => {
        const currentEmployees = this.employeesSubject.value;
        this.employeesSubject.next([...currentEmployees, newEmployee]);
        this.refreshSubject.next();
      }),
      catchError(error => {
        console.error('Error creating employee:', error);
        return throwError(error);
      })
    );
  }

  updateEmployee(id: string, employeeData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, employeeData, { headers: this.getAuthHeaders() }).pipe(
      tap(updatedEmployee => {
        const currentEmployees = this.employeesSubject.value;
        const index = currentEmployees.findIndex(e => e.id === id);
        if (index !== -1) {
          currentEmployees[index] = updatedEmployee;
          this.employeesSubject.next([...currentEmployees]);
          this.refreshSubject.next();
        }
      }),
      catchError(error => {
        console.error(`Error updating employee ${id}:`, error);
        return throwError(error);
      })
    );
  }

  deleteEmployee(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
      tap(() => {
        const currentEmployees = this.employeesSubject.value;
        this.employeesSubject.next(currentEmployees.filter(e => e.id !== id));
        this.refreshSubject.next();
      }),
      catchError(error => {
        console.error(`Error deleting employee ${id}:`, error);
        return throwError(error);
      })
    );
  }

  // Métodos para documentos de empleados
  getEmployeeDocuments(employeeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${employeeId}/documents`, { headers: this.getAuthHeaders() }).pipe(
      catchError(error => {
        console.error(`Error getting documents for employee ${employeeId}:`, error);
        return throwError(error);
      })
    );
  }

  uploadEmployeeDocument(employeeId: string, file: File, type: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    return this.http.post(`${this.apiUrl}/${employeeId}/documents`, formData, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error uploading document for employee ${employeeId}:`, error);
        return throwError(error);
      })
    );
  }

  deleteEmployeeDocument(employeeId: string, documentId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${employeeId}/documents/${documentId}`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error deleting document for employee ${employeeId}:`, error);
        return throwError(error);
      })
    );
  }

  // Métodos para ajustes de nómina
  saveAdjustments(employeeId: string, adjustments: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/${employeeId}/adjustments`, adjustments, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error saving adjustments for employee ${employeeId}:`, error);
        return throwError(error);
      })
    );
  }

  getEmployeeAdjustments(employeeId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${employeeId}/adjustments`, {
      headers: this.getAuthHeaders()
    }).pipe(
      catchError(error => {
        console.error(`Error getting adjustments for employee ${employeeId}:`, error);
        return throwError(error);
      })
    );
  }

  // Método para refrescar datos
  refreshEmployees(): void {
    this.getEmployees().subscribe();
  }
}
