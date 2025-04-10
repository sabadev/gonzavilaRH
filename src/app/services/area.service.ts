// services/area.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class AreaService {
  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/area`;
  }

  // Obtener todas las áreas
  getAreas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear una nueva área
  createArea(area: any): Observable<any> {
    return this.http.post(this.apiUrl, area);
  }

  // Actualizar un área
  updateArea(id: number, area: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, area);
  }

  // Eliminar un área
  deleteArea(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}