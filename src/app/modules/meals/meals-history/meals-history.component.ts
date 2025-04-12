import { Component, OnInit } from '@angular/core';
import { MealsService } from 'src/app/services/meals.service';

@Component({
  selector: 'app-meals-history',
  templateUrl: './meals-history.component.html',
  styleUrls: ['./meals-history.component.scss']
})
export class MealsHistoryComponent implements OnInit {
  mealHistory: any[] = [];

  constructor(private mealsService: MealsService) {}

  ngOnInit() {
    this.loadMealHistory();
  }

  loadMealHistory() {
    this.mealsService.getMealHistory('currentEmployeeId').subscribe((data: any[]) => {
      this.mealHistory = data;
    });
  }
}
