// components/add-area-modal/add-area-modal.component.ts
import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AreaService } from 'src/app/services/area.service';

@Component({
  selector: 'app-add-area-modal',
  templateUrl: './add-area-modal.component.html',
  styleUrls: ['./add-area-modal.component.scss'],
})
export class AddAreaModalComponent {
  newArea: any = {
    name: '',
  };

  constructor(
    private modalController: ModalController,
    private areaService: AreaService
  ) {}

  // Guardar la nueva área
  saveArea(): void {
    this.areaService.createArea(this.newArea).subscribe({
      next: (response: any) => {
        this.modalController.dismiss({ newArea: response }); // Cerrar el modal y devolver la nueva área
      },
      error: (err: any) => {
        console.error('Error al crear el área:', err);
      },
    });
  }

  // Cerrar el modal sin guardar
  dismiss(): void {
    this.modalController.dismiss();
  }
}