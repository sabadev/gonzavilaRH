import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeesRoutingModule } from './employees-routing.module';
import { FormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";
import { EmployeeFilesComponent } from './employee-files/employee-files.component';





@NgModule({
  declarations: [
    EmployeesListComponent, EmployeeDetailComponent,EmployeeFilesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    EmployeesRoutingModule,
    SharedModule,


]
})
export class EmployeesModule { }
