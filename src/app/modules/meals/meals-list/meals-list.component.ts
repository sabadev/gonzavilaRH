import { Component, OnInit, OnDestroy } from '@angular/core';
import { MealsService } from 'src/app/services/meals.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AlertController, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

interface Meal {
  id: number;
  name: string;
  description: string;
}

interface MealSelection {
  mealId: number;
  date: string;
}

@Component({
  selector: 'app-meals-list',
  templateUrl: './meals-list.component.html',
  styleUrls: ['./meals-list.component.scss'],
})
export class MealsListComponent implements OnInit, OnDestroy {
  meals: Meal[] = [];
  selectedDate: string = '';
  selectedMealId: number | null = null;
  selectedMealName: string | null = null;
  alreadySelected: boolean = false;
  private subscriptions = new Subscription();

  constructor(
    private mealsService: MealsService,
    private router: Router,
    private alertController: AlertController,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.selectedDate = this.getCurrentDate();
    this.loadMealsForDate(this.selectedDate);
    this.setupNavigationListener();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  private setupNavigationListener(): void {
    this.subscriptions.add(
      this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
        if (this.router.url.includes('/meals')) {
          this.loadMealsForDate(this.selectedDate);
        }
      })
    );
  }

  onDateChange(event: any): void {
    const newDate = event.detail.value.split('T')[0];
    if (this.selectedDate !== newDate) {
      this.selectedDate = newDate;
      this.loadMealsForDate(newDate);
    }
  }

  private loadMealsForDate(date: string): void {
    const employeeId = this.authService.getEmployeeId();
    if (!employeeId) return;

    this.mealsService.getMealsByDate(date).subscribe({
      next: (meals: Meal[]) => {
        this.meals = meals;
        this.checkMealSelection(employeeId, date);
      },
      error: () => this.presentToast('Error al cargar las comidas.', 'danger'),
    });
  }

  private checkMealSelection(employeeId: number, date: string): void {
    this.mealsService.getMealSelection(employeeId.toString(), date).subscribe({
      next: (selection: MealSelection | null) => {
        if (selection) {
          this.selectedMealId = selection.mealId;
          this.selectedMealName = this.meals.find((meal) => meal.id === this.selectedMealId)?.name || null;
          this.alreadySelected = true;
        } else {
          this.resetSelection();
        }
      },
      error: () => this.presentToast('Error al verificar la selección de comida.', 'danger'),
    });
  }

  resetSelection(): void {
    this.selectedMealId = null;
    this.selectedMealName = null;
    this.alreadySelected = false;
  }

  async confirmSelection(mealId?: number | null): Promise<void> {
    if (mealId != null) {
      this.selectedMealId = mealId;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar Selección',
      message: this.alreadySelected
        ? '¿Quieres cambiar tu selección de comida?'
        : '¿Estás seguro de que deseas seleccionar esta comida?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Confirmar',
          handler: () => this.saveMealSelection(),
        },
      ],
    });

    await alert.present();
  }

  private saveMealSelection(): void {
    const employeeId = this.authService.getEmployeeId();
    if (!employeeId || !this.selectedMealId) return;

    const payload = {
      employeeId: employeeId.toString(), // Convierte a string
      date: this.selectedDate,
      mealId: this.selectedMealId.toString(),
    };

    this.mealsService.saveMealSelection(payload).subscribe({
      next: () => {
        this.presentToast('Selección guardada con éxito.');
        this.alreadySelected = true;
        this.selectedMealName = this.meals.find((meal) => meal.id === this.selectedMealId)?.name || null;
      },
      error: () => this.presentToast('Error al guardar la selección.', 'danger'),
    });
  }

  async presentAddMealAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Añadir Nuevo Menú',
      inputs: [
        {
          name: 'mealName',
          type: 'text',
          placeholder: 'Nombre del menú',
        },
        {
          name: 'mealDesc',
          type: 'text',
          placeholder: 'Descripción del menú',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const mealName = data.mealName?.trim();
            const mealDesc = data.mealDesc?.trim();

            if (!mealName || !mealDesc) {
              this.presentToast('Debe ingresar nombre y descripción.', 'danger');
              return false; // No cerrar el alert si los datos están vacíos
            }

            const newMeal = { name: mealName, description: mealDesc, date: this.selectedDate };

            this.mealsService.addMeal(newMeal).subscribe({
              next: () => {
                this.presentToast('Menú añadido con éxito.');
                this.loadMealsForDate(this.selectedDate);
              },
              error: () => this.presentToast('Error al añadir el menú.', 'danger'),
            });

            return true; // Cerrar el alert si todo salió bien
          },
        },
      ],
    });

    await alert.present();
  }

  private async presentToast(message: string, color: string = 'success'): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
    });
    toast.present();
  }
}
