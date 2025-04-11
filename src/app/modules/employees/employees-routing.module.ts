import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeFilesComponent } from './employee-files/employee-files.component';
import { AuthGuard } from 'src/app/guards/auth.guard'; // Adjust the path as necessary

const routes: Routes = [
  {
    path: '',
    component: EmployeesListComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detail',
    component: EmployeeDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detail/:id',
    component: EmployeeDetailComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'files/:id',
    component: EmployeeFilesComponent,
    canActivate: [AuthGuard]
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {}
