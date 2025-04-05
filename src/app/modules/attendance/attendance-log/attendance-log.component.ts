import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  employeeId: number | null = null;
  recentLogs: AttendanceLog[] = [];
  hasEntry = false;
  hasExit = false;
  loading = false;
  message = '';
  photo: File | null = null;

  constructor(
    private attendanceService: AttendanceService,
    private authService: AuthService,
    private router: Router
  ) {}

  captureSupported: boolean = 'capture' in HTMLInputElement.prototype;

  ngOnInit(): void {
    this.loadEmployeeId();
    if (this.employeeId) {
      this.getRecentLogs();
    } else {
      console.error('No se pudo obtener el ID del empleado.');
    }
  }

  private loadEmployeeId(): void {
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedEmployeeId) {
      this.employeeId = parseInt(storedEmployeeId, 10);
    } else {
      console.error('No se encontró employeeId en el localStorage.');
    }
  }

  getRecentLogs(): void {
    if (!this.employeeId) {
      console.error('No se puede cargar logs sin un ID de empleado.');
      return;
    }

    this.attendanceService.getRecentLogs(this.employeeId).subscribe({
      next: (data: AttendanceLog[]) => {
        this.recentLogs = data;

        const today = new Date().toISOString().split('T')[0];
        this.hasEntry = data.some(
          (log) => log.log_type === 'entry' && log.log_time.startsWith(today)
        );
        this.hasExit = data.some(
          (log) => log.log_type === 'exit' && log.log_time.startsWith(today)
        );
      },
      error: (error) => {
        console.error('Error al obtener logs recientes:', error);
      },
    });
  }

  async compressImage(file: File): Promise<File> {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        img.src = event.target.result;
        img.onload = () => {
          const MAX_WIDTH = 800;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name, { type: 'image/jpeg' });
                resolve(compressedFile);
              } else {
                reject(new Error('No se pudo comprimir la imagen.'));
              }
            },
            'image/jpeg',
            0.8 // Calidad de compresión
          );
        };
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async capturePhoto(event: any): Promise<void> {
    const file = event.target.files[0];
    if (file) {
      try {
        this.photo = await this.compressImage(file);
      } catch (error) {
        console.error('Error al comprimir la foto:', error);
      }
    }
  }

  registerAttendanceWithPhoto(logType: string): void {
    if (!this.employeeId || !this.photo) {
      console.error('Falta información para registrar asistencia.');
      return;
    }

    this.loading = true;
    const formData = new FormData();
    formData.append('employee_id', this.employeeId.toString());
    formData.append('log_type', logType);
    formData.append('photo', this.photo);

    this.attendanceService.registerLogWithPhoto(formData).subscribe({
      next: (response) => {
        this.message = response.message;
        this.loading = false;
        this.getRecentLogs();
      },
      error: (error) => {
        this.message = error.error?.error || 'Error al registrar asistencia.';
        this.loading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  triggerPhotoInput(photoInput: HTMLInputElement): void {
    photoInput.click();
  }


}
