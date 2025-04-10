// position-list-popover.component.ts
import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { PositionService } from 'src/app/services/positions.service';
import { AddPositionModalComponent } from '../add-position-modal/add-position-modal.component';

@Component({
  selector: 'app-position-list-popover',
  templateUrl: './position-list-popover.component.html',
  styleUrls: ['./position-list-popover.component.scss'],
})
export class PositionListPopoverComponent implements OnInit {
  positions: any[] = []; // Lista completa de posiciones
  filteredPositions: any[] = []; // Lista filtrada de posiciones

  constructor(
    private popoverController: PopoverController,
    private positionService: PositionService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  // Cargar las posiciones
  loadPositions(): void {
    this.positionService.searchPositions().subscribe({
      next: (positions: any[]) => {
        this.positions = positions;
        this.filteredPositions = positions; // Inicialmente, mostrar todas las posiciones
      },
      error: (err: any) => {
        console.error('Error al cargar posiciones:', err);
      },
    });
  }

  // Filtrar posiciones según el término de búsqueda
  searchPositions(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredPositions = this.positions.filter((position) =>
      position.name.toLowerCase().includes(searchTerm)
    );
  }

  // Seleccionar una posición
  selectPosition(position: any): void {
    this.popoverController.dismiss({
      positionSelected: position, // Devuelve la posición seleccionada
    });
  }

  // Abrir modal para agregar una nueva posición
  async openAddPositionModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddPositionModalComponent,
    });

    await modal.present();

    // Actualizar la lista de posiciones después de cerrar el modal
    const { data } = await modal.onDidDismiss();
    if (data?.newPosition) {
      this.loadPositions(); // Recargar las posiciones
    }
  }
}