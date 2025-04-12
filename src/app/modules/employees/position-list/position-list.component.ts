import { Component, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { PositionService } from 'src/app/services/positions.service';
import { AddPositionModalComponent } from '../add-position-modal/add-position-modal.component';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.scss'],
})
export class PositionListComponent implements OnInit {
  positions: any[] = [];
  filteredPositions: any[] = [];
  searchTerm: string = '';
  selectedPositionName: string = '';
  isDropdownOpen: boolean = false;
  selectedPosition: any = null;

  constructor(
    private positionService: PositionService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.searchPositions().subscribe({
      next: (positions: any[]) => {
        this.positions = positions;
        this.filteredPositions = positions;
      },
      error: (err) => console.error('Error al cargar posiciones:', err)
    });
  }

  searchPositions(): void {
    this.filteredPositions = this.positions.filter(position =>
      position.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectPosition(position: any): void {
    this.selectedPosition = position;
    this.selectedPositionName = position.name;
    this.isDropdownOpen = false;
  }

  async openAddPositionModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddPositionModalComponent
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.newPosition) {
      this.loadPositions();
    }
  }

  async openEditPositionModal(): Promise<void> {
    if (!this.selectedPosition) return;

    const modal = await this.modalController.create({
      component: AddPositionModalComponent,
      componentProps: {
        positionData: this.selectedPosition
      }
    });

    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      this.loadPositions();
      this.selectedPositionName = data.position.name;
    }
  }

  async deletePosition(): Promise<void> {
    if (!this.selectedPosition) return;

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de eliminar la posición "${this.selectedPosition.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            try {
              await this.positionService.deletePosition(this.selectedPosition.id).toPromise();
              this.selectedPosition = null;
              this.selectedPositionName = '';
              this.loadPositions();
            } catch (error) {
              console.error('Error al eliminar posición:', error);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      this.loadPositions();
    }
  }
}
