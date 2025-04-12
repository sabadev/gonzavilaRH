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

  }
}
