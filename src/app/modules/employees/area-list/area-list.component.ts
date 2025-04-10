// components/area-list/area-list.component.ts
import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../services/area.service';
import { ModalController } from '@ionic/angular';
import { AddAreaModalComponent } from '../add-area-modal/add-area-modal.component';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.scss'],
})
export class AreaListComponent implements OnInit {
  areas: any[] = []; // Lista completa de áreas
  filteredAreas: any[] = []; // Lista filtrada de áreas
  searchTerm: string = ''; // Término de búsqueda
  selectedAreaName: string = ''; // Nombre del área seleccionada
  isDropdownOpen: boolean = false; // Estado del dropdown (abierto/cerrado)

  constructor(
    private areaService: AreaService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadAreas(); // Cargar las áreas al iniciar el componente
  }

  // Cargar todas las áreas
  loadAreas(): void {
    this.areaService.getAreas().subscribe({
      next: (areas: any[]) => {
        this.areas = areas;
        this.filteredAreas = areas; // Inicialmente, mostrar todas las áreas
      },
      error: (err: any) => {
        console.error('Error al cargar áreas:', err);
      },
    });
  }

  // Filtrar áreas según el término de búsqueda
  searchAreas(): void {
    this.filteredAreas = this.areas.filter((area) =>
      area.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  // Seleccionar un área
  selectArea(area: any): void {
    this.selectedAreaName = area.name; // Actualizar el nombre del área seleccionada
    this.isDropdownOpen = false; // Cerrar el dropdown
    // Aquí puedes emitir un evento o guardar el área seleccionada en un servicio
  }

  // Abrir modal para agregar una nueva área
  async openAddAreaModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddAreaModalComponent,
    });

    await modal.present();

    // Actualizar la lista de áreas después de cerrar el modal
    const { data } = await modal.onDidDismiss();
    if (data?.newArea) {
      this.loadAreas(); // Recargar las áreas
    }
  }

  // Abrir o cerrar el dropdown
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}