import { Component, OnInit } from '@angular/core';
import { PositionService } from 'src/app/services/positions.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss'],
})
export class PositionListComponent implements OnInit {
  positions: any[] = [];

  constructor(
    private positionService: PositionService,
    private popoverController: PopoverController
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.searchPositions().subscribe({
      next: (positions: any[]) => {
        this.positions = positions;
      },
      error: (err: any) => {
        console.error('Error al cargar posiciones:', err);
      },
    });
  }

  selectPosition(position: any): void {
    this.popoverController.dismiss(position); // Cierra el popover y devuelve la posición seleccionada
  }
}