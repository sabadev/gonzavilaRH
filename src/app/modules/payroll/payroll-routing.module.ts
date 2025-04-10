import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayrollsListComponent } from './payrolls-list/payrolls-list.component';
import { CreatePayrollComponent } from './create-payroll/create-payroll.component';
import { PayrollMovementsComponent } from './payroll-movements/payroll-movements.component';
import { PayrollEmployeesComponent } from './payroll-employees/payroll-employees.component';
import { PayrollDetailsComponent } from './payroll-detail/payroll-detail.component';

const routes: Routes = [
  { path: '', component: PayrollsListComponent }, // Página principal de nóminas
  { path: 'payrolls', component: PayrollsListComponent }, // Página principal de nóminas
  { path: 'create', component: CreatePayrollComponent }, // Crear nómina
  { path: 'details/:id', component: PayrollDetailsComponent }, // Detalles de nómina
  { path: 'employees/:id', component: PayrollEmployeesComponent }, // Empleados asociados
  { path: 'movements/:payrollId/:employeeId', component: PayrollMovementsComponent } // Bonos y descuentos
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollRoutingModule {

}
