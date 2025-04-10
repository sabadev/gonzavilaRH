import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { PositionService } from 'src/app/services/positions.service';
import { AddPositionModalComponent } from '../add-position-modal/add-position-modal.component';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss'],
})
export class PositionListComponent implements OnInit {
  positions: any[] = []; // Lista completa de posiciones
  filteredPositions: any[] = []; // Lista filtrada de posiciones
  searchTerm: string = ''; // Término de búsqueda
  selectedPositionName: string = ''; // Nombre de la posición seleccionada
  isDropdownOpen: boolean = false; // Estado del dropdown (abierto/cerrado)

  constructor(
    private positionService: PositionService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadPositions(); // Cargar las posiciones al iniciar el componente
  }

  // Cargar todas las posiciones
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
  searchPositions(): void {
    this.filteredPositions = this.positions.filter((position) =>
      position.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Seleccionar una posición
  selectPosition(position: any): void {
    this.selectedPositionName = position.name; // Actualizar el nombre de la posición seleccionada
    this.isDropdownOpen = false; // Cerrar el dropdown
    // Aquí puedes emitir un evento o guardar la posición seleccionada en un servicio
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

  // Abrir o cerrar el dropdown
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}