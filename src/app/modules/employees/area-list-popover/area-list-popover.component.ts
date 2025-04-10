// components/area-list-popover/area-list-popover.component.ts
import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AreaService } from 'src/app/services/area.service';

@Component({
  selector: 'app-area-list-popover',
  templateUrl: './area-list-popover.component.html',
  styleUrls: ['./area-list-popover.component.scss'],
})
export class AreaListPopoverComponent implements OnInit {
  areas: any[] = []; // Lista completa de áreas
  filteredAreas: any[] = []; // Lista filtrada de áreas

  constructor(
    private popoverController: PopoverController,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.loadAreas(); // Cargar las áreas al iniciar
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
  searchAreas(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredAreas = this.areas.filter((area) =>
      area.name.toLowerCase().includes(searchTerm)
    );
  }

  // Seleccionar un área
  selectArea(area: any): void {
    this.popoverController.dismiss({
      areaSelected: area, // Devuelve el área seleccionada
    });
  }
}