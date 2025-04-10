import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealsService } from 'src/app/services/meals.service';

@Component({
  selector: 'app-edit-meal',
templateUrl:'edit-meal.component.html',
  styleUrls: ['./edit-meal.component.scss']
})
export class EditMealComponent implements OnInit {
  meal: any = {
    name: '',
    description: '',
    date: ''
  };

  constructor(
    private route: ActivatedRoute,
    private mealsService: MealsService,
    private router: Router
  ) {}

  ngOnInit() {
    const mealId = this.route.snapshot.paramMap.get('id');
    if (mealId) {
      this.mealsService.getMealById(mealId).subscribe(data => {
        this.meal = data;
      });
    }
  }

  updateMeal() {
    this.mealsService.updateMeal(this.meal.id, this.meal).subscribe(() => {
      alert('Comida actualizada con éxito.');
      this.router.navigate(['/meals']);
    });
  }
}
