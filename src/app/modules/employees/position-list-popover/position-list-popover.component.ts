import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController, AlertController } from '@ionic/angular';
import { PositionService } from 'src/app/services/positions.service';
import { AddPositionModalComponent } from '../add-position-modal/add-position-modal.component';
import { Position } from 'src/app/interfaces/position.interface';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-position-list-popover',
  templateUrl: './position-list-popover.component.html',
  styleUrls: ['./position-list-popover.component.scss'],
})
export class PositionListPopoverComponent implements OnInit {
  positions: Position[] = [];
  filteredPositions: Position[] = [];
  isLoading = true;
  searchTerm = '';
  errorLoading = false;
  selectedPosition: Position | null = null;

  constructor(
    private popoverController: PopoverController,
    private positionService: PositionService,
    private modalController: ModalController,
    private alertController: AlertController
  ) {}

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.isLoading = true;
    this.errorLoading = false;

    this.positionService.searchPositions()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (positions: Position[]) => {
          this.positions = positions;
          this.filteredPositions = [...positions];
        },
        error: (err) => {
          console.error('Error loading positions:', err);
          this.errorLoading = true;
        }
      });
  }

  searchPositions(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
    this.filteredPositions = this.positions.filter(position =>
      position.name.toLowerCase().includes(this.searchTerm)
    );
  }

  selectPosition(position: Position): void {
    this.selectedPosition = position;
  }

  async openAddPositionModal(): Promise<void> {
    const modal = await this.modalController.create({
      component: AddPositionModalComponent,
      cssClass: 'auto-height-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      this.loadPositions();
    }
  }

  async openEditPositionModal(): Promise<void> {
    if (!this.selectedPosition) return;

    const modal = await this.modalController.create({
      component: AddPositionModalComponent,
      componentProps: {
        positionData: this.selectedPosition
      },
      cssClass: 'auto-height-modal'
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();
    if (data?.saved) {
      this.loadPositions();
      this.selectedPosition = null;
    }
  }

  async confirmDelete(): Promise<void> {
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
          handler: () => this.deletePosition()
        }
      ]
    });

    await alert.present();
  }

  async deletePosition(): Promise<void> {
    if (!this.selectedPosition) return;

    try {
      if (this.selectedPosition?.id !== undefined) {
        await this.positionService.deletePosition(this.selectedPosition.id).toPromise();
      } else {
        console.error('Error: selectedPosition.id is undefined');
      }
      this.loadPositions();
      this.selectedPosition = null;
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  }

  confirmSelection(): void {
    if (this.selectedPosition) {
      this.popoverController.dismiss({
        positionSelected: this.selectedPosition,
      });
    }
  }

  retryLoadPositions(): void {
    this.loadPositions();
  }

  dismiss(): void {
    this.popoverController.dismiss();
  }
}
