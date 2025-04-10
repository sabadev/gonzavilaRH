import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    return this.http.get<any[]>(`${this.apiUrl}`).pipe(
      catchError((error) => {
        console.error('Error al obtener posiciones:', error);
        return throwError(() => new Error('Error al obtener posiciones.'));
      })
    );
  }

  /**
   * Buscar posiciones por nombre.
   * @param searchTerm Término de búsqueda (opcional).
   */
  searchPositions(searchTerm?: string): Observable<any[]> {
    const url = searchTerm ? `${this.apiUrl}/search?q=${encodeURIComponent(searchTerm)}` : `${this.apiUrl}`;
    return this.http.get<any[]>(url).pipe(
      catchError((error) => {
        console.error('Error al buscar posiciones:', error);
        return throwError(() => new Error('Error al buscar posiciones.'));
      })
    );
  }

  /**
   * Crear una nueva posición.
   * @param position Datos de la posición a crear.
   */
  createPosition(position: { name: string; parent_id?: number }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, position).pipe(
      catchError((error) => {
        console.error('Error al crear posición:', error);
        return throwError(() => new Error('Error al crear posición.'));
      })
    );
  }

  /**
   * Actualizar una posición existente.
   * @param id ID de la posición a actualizar.
   * @param position Datos actualizados de la posición.
   */
  updatePosition(id: number, position: { name: string; parent_id?: number }): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, position).pipe(
      catchError((error) => {
        console.error('Error al actualizar posición:', error);
        return throwError(() => new Error('Error al actualizar posición.'));
      })
    );
  }

  /**
   * Eliminar una posición.
   * @param id ID de la posición a eliminar.
   */
  deletePosition(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error al eliminar posición:', error);
        return throwError(() => new Error('Error al eliminar posición.'));
      })
    );
  }
}