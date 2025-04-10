import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MealsRoutingModule } from './meals-routing.module';
import { MealsListComponent } from './meals-list/meals-list.component';
import { MealsHistoryComponent } from './meals-history/meals-history.component';
import { FormsModule } from '@angular/forms';
import { AddMealComponent } from './add-meal/add-meal.component';
import { EditMealComponent } from './edit-meal/edit-meal.component';
import { MealReportComponent } from './meal-report/meal-report.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    MealsListComponent,
    MealsHistoryComponent,
    AddMealComponent,
    EditMealComponent,
    MealReportComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    MealsRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class MealsModule {}
