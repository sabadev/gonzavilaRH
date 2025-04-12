import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Payroll, Employee } from '../models/employees.interface';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class PayrollsService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = this.configService.apiUrl + '/payrolls';
  }

  getPayrolls(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}`);
  }

  getPayrollDetails(id: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/${id}`);
  }

  createPayroll(data: Partial<Payroll>): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  updatePayroll(id: number, data: Payroll): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deletePayroll(payrollId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${payrollId}`);
  }
  getPayrollEmployees(payrollId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/payrolls/${payrollId}/employees`);
  }
}
