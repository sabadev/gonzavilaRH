import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/meals`;
  }

  getMealsByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/date`, { params: { date } }).pipe(
      catchError((error) => {
        console.error('Error al obtener comidas:', error);
        return throwError(() => new Error('Error al obtener comidas.'));
      })
    );
  }

  addMeal(meal: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, meal);
  }

  deleteMeal(mealId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${mealId}`);
  }

  saveMealSelection(employeeId: string, date: string, mealId: string): Observable<any> {
    const selection = { employeeId, date, mealId };
    return this.http.post(`${this.apiUrl}/selections`, selection);
  }

  getMealSelection(employeeId: string, date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/selections`, { params: { employeeId, date } });
  }

  getMealReportByRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/report`, { params: { startDate, endDate } });
  }

  getDailyMealReport(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report/daily`, { params: { date } });
  }

  // Métodos adicionales para corregir errores
  getMealById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  updateMeal(id: string, meal: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, meal);
  }

  getMealHistory(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`, { params: { employeeId } });
  }

  getMealReport(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/report`, {
      params: { startDate, endDate },
    });
  }
}
