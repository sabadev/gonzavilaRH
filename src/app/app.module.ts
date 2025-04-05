import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfigService } from './services/config.service';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from './modules/shared/shared.module';
import { AuthInterceptor } from './interceptors/auth.interceptor'; // Importa el interceptor
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Función para inicializar la configuración de la aplicación
export function initializeApp(configService: ConfigService): () => Promise<void> {
  return () =>
    configService
      .loadConfig()
      .catch((err) => {
        console.error('Error al cargar la configuración:', err);
        return Promise.reject(err);
      });
}

@NgModule({
  declarations: [AppComponent], // Solo declara los componentes que pertenecen directamente al módulo
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    IonicModule.forRoot(),
    SharedModule, // SharedModule ya gestiona sus propios componentes
    BrowserAnimationsModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [ConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS, // Registra el interceptor
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
