import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeFilesComponent } from './employee-files/employee-files.component';

const routes: Routes = [
  { path: '', component: EmployeesListComponent }, // Lista de empleados
  {
    path: 'detail', // Ruta para crear un nuevo empleado
    component: EmployeeDetailComponent,
  },
  {
    path: 'detail/:id', // Ruta para editar un empleado existente
    component: EmployeeDetailComponent,
  },
  {
    path: 'files/:id', // Nueva ruta para gestionar el expediente
    component: EmployeeFilesComponent,
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {}
