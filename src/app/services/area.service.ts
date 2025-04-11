import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Area } from '../interfaces/position.interface';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class AreaService {
  private apiUrl: string;

  // Datos mock de áreas basados en tu estructura de base de datos
  private mockAreas: Area[] = [
    { id: 1, name: 'Administración' },
    { id: 2, name: 'Recursos Humanos' },
    { id: 3, name: 'TI' },
    { id: 4, name: 'Operaciones' }
  ];

  constructor(
    private http: HttpClient,
    private configService: ConfigService
  ) {
    this.apiUrl = `${this.configService.apiUrl}/areas`;
  }

  getAreas(): Observable<Area[]> {
    return this.http.get<Area[]>(this.apiUrl).pipe(
      catchError(error => {
        console.warn('API de áreas no disponible, usando datos mock');
        return of(this.mockAreas); // Retorna datos mock si el API falla
      })
    );
  }

  createArea(name: string): Observable<Area> {
    return this.http.post<Area>(this.apiUrl, { name }).pipe(
      catchError(error => {
        console.warn('API de áreas no disponible, simulando creación');
        const newArea: Area = {
          id: Math.max(...this.mockAreas.map(a => a.id)) + 1,
          name
        };
        this.mockAreas.push(newArea);
        return of(newArea);
      })
    );
  }
  updateArea(id: number, name: string): Observable<Area> {
    return this.http.put<Area>(`/api/areas/${id}`, { name });
  }

  deleteArea(id: number): Observable<void> {
    return this.http.delete<void>(`/api/areas/${id}`);
  }
}


