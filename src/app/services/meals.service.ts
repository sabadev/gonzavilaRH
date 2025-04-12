import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class MealsService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/meals`;
  }

  /** Obtener comidas por fecha */
  getMealsByDate(date: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { params: { date } });
  }
  /** ✅ Añadir una nueva comida */
  createMeal(meal: { name: string; description: string; date: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, meal);
  }

  /** Eliminar comida */
  deleteMeal(mealId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${mealId}`);
  }

  /** ✅ Guardar selección de comida */
  saveMealSelection(payload: { employeeId: string; date: string; mealId: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/selections`, payload);
  }

  /** Obtener selección de comida de un empleado */
  getMealSelection(employeeId: string, date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/selections`, { params: { employeeId, date } });
  }

  /** Obtener reporte de comidas en un rango de fechas */
  getMealReportByRange(startDate: string, endDate: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/report`, { params: { startDate, endDate } });
  }

  addMeal(meal: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, meal);
  }

  /** Obtener reporte de comidas diarias */
  getDailyMealReport(date: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report/daily`, { params: { date } });
  }

  /** Obtener información de una comida por ID */
  getMealById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /** ✅ Actualizar una comida */
  updateMeal(id: string, meal: { name: string; description: string; date: string }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, meal);
  }

  /** Obtener historial de comidas de un empleado */
  getMealHistory(employeeId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/history`, { params: { employeeId } });
  }
}