import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController, LoadingController, ActionSheetController } from '@ionic/angular';
import { PositionService } from 'src/app/services/positions.service';
import { AreaService } from 'src/app/services/area.service';
import { Position, Area } from 'src/app/interfaces/position.interface';

@Component({
  selector: 'app-add-position-modal',
  templateUrl: './add-position-modal.component.html',
  styleUrls: ['./add-position-modal.component.scss'],
})
export class AddPositionModalComponent implements OnInit {
  @Input() positionData: Position | null = null;
  isEditMode = false;
  position: Position = {
    name: '',
    parent_id: null,
    area_id: null
  };
  areas: Area[] = [];
  isLoading = true;
  errorLoadingAreas = false;

  constructor(
    private modalController: ModalController,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private positionService: PositionService,
    private areaService: AreaService
  ) {}

  async ngOnInit() {
    if (this.positionData) {
      this.isEditMode = true;
      this.position = { ...this.positionData };
    }
    await this.loadAreas();
  }

  async loadAreas() {
    this.isLoading = true;
    this.errorLoadingAreas = false;
    try {
      const areas = await this.areaService.getAreas().toPromise();
      this.areas = areas || [];
    } catch (error) {
      console.error('Error al cargar áreas:', error);
      this.errorLoadingAreas = true;
      await this.presentAlert('Error', 'No se pudieron cargar las áreas', 'danger');
    } finally {
      this.isLoading = false;
    }
  }

  async openAreaManagement() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Administrar Áreas',
      buttons: [
        {
          text: 'Agregar Nueva Área',
          icon: 'add-outline',
          handler: () => this.createNewArea()
        },
        {
          text: 'Editar Área Seleccionada',
          icon: 'create-outline',
          handler: () => this.editSelectedArea(),
          disabled: !this.position.area_id
        },
        {
          text: 'Eliminar Área Seleccionada',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => this.confirmDeleteArea(),
          disabled: !this.position.area_id
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async createNewArea() {
    const alert = await this.alertController.create({
      header: 'Nueva Área',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Nombre del área',
          attributes: { required: true }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.name) {
              await this.presentAlert('Advertencia', 'El nombre del área es obligatorio', 'warning');
              return false;
            }

            const loading = await this.loadingController.create({
              message: 'Creando área...',
            });
            await loading.present();

            try {
              const newArea = await this.areaService.createArea(data.name).toPromise();
              if (newArea) {
                this.areas = [...this.areas, newArea];
                this.position.area_id = newArea.id;
              }
              await this.presentAlert('Éxito', 'Área creada correctamente', 'success');
              return true;
            } catch (error) {
              console.error('Error al crear área:', error);
              await this.presentAlert('Error', 'No se pudo crear el área', 'danger');
              return false;
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async editSelectedArea() {
    if (!this.position.area_id) return;

    const areaToEdit = this.areas.find(a => a.id === this.position.area_id);
    if (!areaToEdit) return;

    const alert = await this.alertController.create({
      header: 'Editar Área',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: areaToEdit.name,
          placeholder: 'Nombre del área',
          attributes: { required: true }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.name) {
              await this.presentAlert('Advertencia', 'El nombre del área es obligatorio', 'warning');
              return false;
            }

            const loading = await this.loadingController.create({
              message: 'Actualizando área...',
            });
            await loading.present();

            try {
              const updatedArea = await this.areaService.updateArea(areaToEdit.id, data.name).toPromise();
              if (updatedArea) {
                this.areas = this.areas.map(a =>
                  a.id === areaToEdit.id ? updatedArea : a
                );
                areaToEdit.name = data.name;
              }
              await this.presentAlert('Éxito', 'Área actualizada correctamente', 'success');
              return true;
            } catch (error) {
              console.error('Error al actualizar área:', error);
              await this.presentAlert('Error', 'No se pudo actualizar el área', 'danger');
              return false;
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmDeleteArea() {
    if (!this.position.area_id) return;

    const areaToDelete = this.areas.find(a => a.id === this.position.area_id);
    if (!areaToDelete) return;

    const alert = await this.alertController.create({
      header: 'Confirmar Eliminación',
      message: `¿Estás seguro de eliminar el área "${areaToDelete.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          handler: async () => {
            const loading = await this.loadingController.create({
              message: 'Eliminando área...',
            });
            await loading.present();

            try {
              await this.areaService.deleteArea(areaToDelete.id).toPromise();
              this.areas = this.areas.filter(a => a.id !== areaToDelete.id);
              this.position.area_id = null;
              await this.presentAlert('Éxito', 'Área eliminada correctamente', 'success');
            } catch (error) {
              console.error('Error al eliminar área:', error);
              await this.presentAlert('Error', 'No se pudo eliminar el área', 'danger');
            } finally {
              await loading.dismiss();
            }
          }
        }
      ]
    });
    await alert.present();
  }

  async savePosition() {
    if (!this.position.name) {
      await this.presentAlert('Advertencia', 'El nombre de la posición es obligatorio', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Guardando...',
    });
    await loading.present();

    try {
      let response: Position;
      if (this.isEditMode && this.position.id) {
        const { id, ...positionData } = this.position;
        const sanitizedPositionData = {
          ...positionData,
          parent_id: positionData.parent_id ?? undefined,
          area_id: positionData.area_id ?? undefined,
        };
        const updatedPosition = await this.positionService.updatePosition(id, sanitizedPositionData).toPromise();
        if (!updatedPosition) throw new Error('Failed to update position');
        response = updatedPosition;
      } else {
        const sanitizedPosition = {
          ...this.position,
          parent_id: this.position.parent_id ?? undefined,
          area_id: this.position.area_id ?? undefined,
        };
        const createdPosition = await this.positionService.createPosition(sanitizedPosition).toPromise();
        if (!createdPosition) throw new Error('Failed to create position');
        response = createdPosition;
      }

      this.modalController.dismiss({
        saved: true,
        position: response
      });
    } catch (error) {
      console.error('Error al guardar posición:', error);
      await this.presentAlert('Error', 'No se pudo guardar la posición', 'danger');
    } finally {
      await loading.dismiss();
    }
  }

  async presentAlert(header: string, message: string, color: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: `alert-${color}`
    });
    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss({ saved: false });
  }
}
