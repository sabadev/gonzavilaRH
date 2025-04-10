import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MealsListComponent } from './meals-list/meals-list.component';
import { AddMealComponent } from './add-meal/add-meal.component';
import { EditMealComponent } from './edit-meal/edit-meal.component';
import { MealReportComponent } from './meal-report/meal-report.component';

const routes: Routes = [
  { path: '', component: MealsListComponent },
  { path: 'add', component: AddMealComponent },
  { path: 'edit/:id', component: EditMealComponent },
  { path: 'report', component: MealReportComponent } // Cambiar 'meals/report' a 'report'
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MealsRoutingModule {}
