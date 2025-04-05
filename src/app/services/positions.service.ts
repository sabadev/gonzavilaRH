import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root',
})
export class PositionService {

  private apiUrl: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.apiUrl = `${this.configService.apiUrl}/positions`;

  }

  /**
   * Obtener todas las posiciones con sus relaciones padre-hijo.
   */
  getPositions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  /**
   * Crear una nueva posición.
   * @param position Datos de la posición a crear.
   */
  createPosition(position: { name: string; parent_id?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, position);
  }

  /**
   * Actualizar una posición existente.
   * @param id ID de la posición a actualizar.
   * @param position Datos actualizados de la posición.
   */
  updatePosition(id: number, position: { name: string; parent_id?: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, position);
  }

  /**
   * Eliminar una posición.
   * @param id ID de la posición a eliminar.
   */
  deletePosition(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
