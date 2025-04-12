import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MealsService } from 'src/app/services/meals.service';

@Component({
  selector: 'app-add-meal',
  templateUrl: './add-meal.component.html',
  styleUrls: ['./add-meal.component.scss']
})
export class AddMealComponent {
  meal = {
    name: '',
    description: '',
    date: ''
  };

  constructor(private mealsService: MealsService, private router: Router) {}

  addMeal() {
    if (this.meal.name && this.meal.description && this.meal.date) {
      this.mealsService.addMeal(this.meal).subscribe(() => {
        alert('Menú agregado con éxito.');
        this.router.navigate(['/meals']);
      });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  }
}
