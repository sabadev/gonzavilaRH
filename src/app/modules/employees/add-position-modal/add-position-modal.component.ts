import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PositionService } from 'src/app/services/positions.service';

@Component({
  selector: 'app-add-position-modal',
  templateUrl: './add-position-modal.component.html',
  styleUrls: ['./add-position-modal.component.scss'],
})
export class AddPositionModalComponent {
  newPosition: any = {
    name: '',
    parent_id: null, // Opcional: puedes agregar un selector para elegir la posición padre
  };

  constructor(
    private modalController: ModalController,
    private positionService: PositionService
  ) {}

  // Guardar la nueva posición
  savePosition(): void {
    this.positionService.createPosition(this.newPosition).subscribe({
      next: (response: any) => {
        this.modalController.dismiss({ newPosition: response }); // Cerrar el modal y devolver la nueva posición
      },
      error: (err: any) => {
        console.error('Error al crear la posición:', err);
      },
    });
  }

  // Cerrar el modal sin guardar
  dismiss(): void {
    this.modalController.dismiss();
  }
}