import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealsService } from 'src/app/services/meals.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.scss']
})
export class MealsListComponent implements OnInit {
  meals: any[] = [];
  selectedDate: string = '';
  selectedMealId: string | null = null;
  private subscriptions: Subscription = new Subscription();
  lastSelectedDate: string | null = null;


  constructor(
    private mealsService: MealsService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private toastController: ToastController
  ) {
    // Escucha los eventos de navegación y verifica la ruta
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          if (this.router.url.includes('/meals')) {
            this.loadMealsForToday();
          }
        })
    );
  }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      console.error('Usuario no autenticado, redirigiendo al login');
      this.router.navigate(['/login']);
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    this.selectedDate = today; // Fecha predeterminada
    this.loadMealsForDate(today); // Carga inicial}


  }

  private getEmployeeId(): string | null {
    console.log('Contenido de localStorage:', localStorage);
    const employeeId = localStorage.getItem('employeeId');

    if (!employeeId || employeeId.trim() === '') {
      console.error('El usuario no está autenticado o employeeId es inválido.');
      this.router.navigate(['/login']); // Redirige al inicio de sesión
      return null;
    }

    if (!/^\d+$/.test(employeeId)) { // Verificar que es un número válido
      console.error('El employeeId en localStorage no es válido.');
      this.router.navigate(['/login']);
      return null;
    }

    return employeeId;
  }



  loadSelectedMeal(): void {
    const savedMealId = localStorage.getItem('selectedMealId');
    if (savedMealId) {
      this.selectedMealId = savedMealId; // Restaurar la selección previa
    }
  }

  loadMealsForToday(): void {
    const today = new Date().toISOString().split("T")[0];
    this.mealsService.getMealsByDate(today).subscribe({
      next: (meals) => {
        this.meals = meals;
      },
      error: (error) => {
        console.error("Error al cargar los menús:", error);
      },
    });
  }

  loadMeals(date: string): void {
    const employeeId = this.getEmployeeId();
    if (!employeeId) return; // Detener si no hay empleado autenticado

    // Obtener las comidas disponibles
    this.mealsService.getMealsByDate(date).subscribe({
      next: (data) => {
        this.meals = data.filter(meal => this.normalizeDate(meal.date) === date);

        // Obtener la selección actual del backend
        this.mealsService.getMealSelection(employeeId, date).subscribe(
          (selection) => {
            this.selectedMealId = selection.mealId; // Resaltar la selección actual
          },
          (error) => {
            console.error('Error al obtener la selección de comida:', error);
            this.selectedMealId = null;
            this.presentToast('No se pudo cargar la selección de comida.', 'warning');
          }
        );
      },
      error: (error) => {
        console.error('Error al cargar las comidas:', error);
        this.presentToast('No se pudieron cargar las comidas disponibles.', 'danger');
      }
    });
  }

  private normalizeDate(date: string): string {
    return date.split('T')[0]; // Extrae solo `YYYY-MM-DD` de la fecha
  }

  selectMeal(mealId: number): void {
    // Convertir mealId a string para mantener consistencia
    this.selectedMealId = mealId.toString();
    localStorage.setItem('selectedMealId', this.selectedMealId); // Guardar en localStorage
  }
  confirmSelection(): void {
    if (this.selectedMealId) {
      const employeeId = this.getEmployeeId();
      if (!employeeId) return; // Detener si no hay empleado autenticado

      const date = this.selectedDate;

      this.mealsService.saveMealSelection(employeeId, date, this.selectedMealId).subscribe({
        next: () => {
          this.presentToast('Selección de comida actualizada exitosamente.');
        },
        error: (error) => {
          console.error('Error al guardar la selección:', error);
          this.presentToast('Ocurrió un error al guardar la selección.', 'danger');
        }
      });
    } else {
      this.presentToast('Por favor, selecciona una comida antes de confirmar.', 'warning');
    }
  }

  onDateChange(event: any): void {
    const selectedDate = event.detail.value.split('T')[0]; // Formato YYYY-MM-DD
    console.log('Fecha seleccionada:', selectedDate); // Confirmar que la fecha es correcta
    this.loadMeals(selectedDate);
  }

  async confirmDelete(id: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: '¿Estás seguro de que deseas eliminar esta comida?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: () => {
            this.deleteMeal(id);
          }
        }
      ]
    });
    await alert.present();
  }

  loadMealsForDate(date: string): void {
    this.lastSelectedDate = date; // Registra la última fecha seleccionada
    this.mealsService.getMealsByDate(date).subscribe({
      next: (meals) => {
        this.meals = meals; // Actualiza la lista de menús
      },
      error: (err) => {
        console.error('Error al cargar los menús:', err);
      }
    });
  }




  deleteMeal(mealId: number): void {
    this.mealsService.deleteMeal(mealId).subscribe({
      next: () => {
        console.log(`Menú con ID ${mealId} eliminado.`);
        // Usa la última fecha seleccionada para recargar
        const dateToReload = this.selectedDate || this.lastSelectedDate;
        if (dateToReload) {
          this.loadMealsForDate(dateToReload);
        } else {
          console.warn('No hay una fecha seleccionada o registrada para recargar menús.');
        }
      },
      error: (err) => {
        console.error('Error al eliminar el menú:', err);
      }
    });
  }




  async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: color,
      position: 'bottom',
      buttons: [
        {
          text: 'Cerrar',
          role: 'cancel'
        }
      ]
    });
    toast.present();
  }
}
