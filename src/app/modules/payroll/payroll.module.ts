import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayrollRoutingModule } from './payroll-routing.module';
import { IonicModule } from '@ionic/angular';
import { PayrollsListComponent } from './payrolls-list/payrolls-list.component';
import { CreatePayrollComponent } from './create-payroll/create-payroll.component';

import { PayrollEmployeesComponent } from './payroll-employees/payroll-employees.component';
import { PayrollMovementsComponent } from './payroll-movements/payroll-movements.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PayrollDetailsComponent } from './payroll-detail/payroll-detail.component';


@NgModule({
  declarations: [
    CreatePayrollComponent,
    PayrollDetailsComponent,
    PayrollEmployeesComponent,
    PayrollMovementsComponent,
    PayrollsListComponent,
  ],
  imports: [
    CommonModule,
    PayrollRoutingModule,
    IonicModule,
    FormsModule,
    SharedModule,
  ]
})
export class PayrollModule { }
