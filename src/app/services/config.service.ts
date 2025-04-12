import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config: { apiUrl?: string } | null = null;

  constructor() {}

  loadConfig(): Promise<void> {
    return fetch('/assets/server-config.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error al cargar configuración: ${response.statusText}`);
        }
        return response.json();
      })
      .then((config) => {
        this.config = config;
      })
      .catch((error) => {
        console.error('Error al cargar configuración:', error);
        throw error; // Re-lanzar error para que APP_INITIALIZER lo detecte
      });
  }

  get apiUrl(): string {
    if (!this.config || !this.config.apiUrl) {
      throw new Error('apiUrl no está configurado');
    }
    return this.config.apiUrl;
  }
}
