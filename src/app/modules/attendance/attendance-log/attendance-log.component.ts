import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController, ModalController } from '@ionic/angular';
import { AttendanceService } from 'src/app/services/attendance.service';
import { AuthService } from 'src/app/services/auth.service';

interface AttendanceLog {
  log_type: string;
  log_time: string;
}

@Component({
  selector: 'app-attendance-log',
  templateUrl: './attendance-log.component.html',
  styleUrls: ['./attendance-log.component.scss'],
})
export class AttendanceLogComponent implements OnInit {

  isHelpModalOpen = false;
  employeeId: number | null = null;
  recentLogs: AttendanceLog[] = [];
  hasEntry = false;
  hasExit = false;
  loading = false;
  photo: File | null = null;
  photoPreviewUrl: string | null = null;
  captureSupported = 'capture' in HTMLInputElement.prototype;
  lastLogType: string | null = null;


  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.loadEmployeeId();
    this.checkCameraSupport();
    this.loadRecentLogs(); // Cargar logs desde el servidor
  }

  private loadEmployeeId(): void {
    const storedEmployeeId = localStorage.getItem('employeeId');
    this.employeeId = storedEmployeeId ? parseInt(storedEmployeeId, 10) : null;
  }

  private checkCameraSupport(): void {
    if (!this.captureSupported) {
      this.showToast('Advertencia: Tu dispositivo podría no soportar la captura directa de fotos', 'warning', 4000);
    }
  }

  async loadRecentLogs(): Promise<void> {
    if (!this.employeeId) return;
  
    try {
      const logs = await this.attendanceService.getRecentLogs(this.employeeId).toPromise();
      this.recentLogs = logs || [];
      this.checkTodaysLogs(); // Actualizar lastLogType y otros estados
    } catch (error) {
      this.showToast('Error al cargar registros recientes', 'danger');
    }
  }

  private checkTodaysLogs(): void {
    const today = new Date().toISOString().split('T')[0];
  
    // Verificar si hay una entrada hoy
    this.hasEntry = this.recentLogs.some(
      (log) => log.log_type === 'entry' && log.log_time.startsWith(today)
    );
  
    // Verificar si hay una salida hoy
    this.hasExit = this.recentLogs.some(
      (log) => log.log_type === 'exit' && log.log_time.startsWith(today)
    );
  
    // Obtener el último registro
    const lastLog = this.recentLogs[0];
    this.lastLogType = lastLog ? lastLog.log_type : null;
  }

  async capturePhoto(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    this.loading = true;
    const file = input.files[0];

    try {
      this.photo = await this.compressImage(file);
      this.photoPreviewUrl = URL.createObjectURL(this.photo);
    } catch (error) {
      this.showToast('Error al procesar la imagen', 'danger');
    } finally {
      this.loading = false;
    }
  }

  private async compressImage(file: File): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          const MAX_SIZE = 800;
          const ratio = Math.min(MAX_SIZE / img.width, MAX_SIZE / img.height);

          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => blob ? resolve(new File([blob], file.name, { type: 'image/jpeg' })) : reject(),
            'image/jpeg',
            0.8
          );
        };
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async registerAttendanceWithPhoto(logType: string): Promise<void> {
    if (!this.employeeId || !this.photo) {
      this.showToast('Debes tomar una foto primero', 'warning');
      return;
    }
  
    this.loading = true;
    const formData = new FormData();
    formData.append('employee_id', this.employeeId.toString());
    formData.append('log_type', logType);
    formData.append('photo', this.photo);
  
    try {
      await this.attendanceService.registerLogWithPhoto(formData).toPromise();
      this.showToast(`Registro de ${logType} exitoso`, 'success');
      this.photoPreviewUrl = null;
  
      // Obtener logs actualizados desde el servidor
      await this.loadRecentLogs();
    } catch (error) {
      const errorMessage = (error as any).error?.error || 'Error en el registro';
      this.showToast(errorMessage, 'danger');
    } finally {
      this.loading = false;
    }
  }


  async logout(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Estás seguro de querer cerrar sesión?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            try {
              // Cierra la sesión en el servidor (si es necesario)
              await this.authService.logout();

              // Borra todo el localStorage
              localStorage.clear();

              // Redirige al usuario a la página de inicio de sesión
              this.router.navigate(['/login']);
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              this.showToast('Error al cerrar sesión', 'danger');
            }
          }
        }
      ]
    });

    await alert.present();
  }


  private async showToast(message: string, color: string = 'success', duration: number = 3000): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration,
      color,
      position: 'top',
      buttons: [{ icon: 'close', role: 'cancel' }]
    });
    toast.present();
  }




}
