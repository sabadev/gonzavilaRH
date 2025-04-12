import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EmployeesRoutingModule } from './employees-routing.module';
import { SharedModule } from '../shared/shared.module';

// Componentes
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeFilesComponent } from './employee-files/employee-files.component';
import { PositionListComponent } from './position-list/position-list.component';
import { AddPositionModalComponent } from './add-position-modal/add-position-modal.component';
import { PositionListPopoverComponent } from './position-list-popover/position-list-popover.component'; // Importa el componente
import { AreaListPopoverComponent } from './area-list-popover/area-list-popover.component'; // Importa el componente

@NgModule({
  declarations: [
    EmployeesListComponent,
    EmployeeDetailComponent,
    EmployeeFilesComponent,
    PositionListComponent,
    AddPositionModalComponent,
    PositionListPopoverComponent, // Declara el componente aquí
    AreaListPopoverComponent,
  ],
  imports: [
    CommonModule,
    IonicModule, // Importa IonicModule
    FormsModule,
    EmployeesRoutingModule,
    SharedModule,
  ],
})
export class EmployeesModule {}
