import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmployeesService } from 'src/app/services/employees.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-employee-files',
  templateUrl: './employee-files.component.html',
  styleUrls: ['./employee-files.component.scss'],
})
export class EmployeeFilesComponent implements OnInit {
  employeeId: string = '';
  employeeName: string = '';
  documents: { type: string; url: string | null }[] = [
    { type: 'Acta de nacimiento', url: null },
    { type: 'INE', url: null },
    { type: 'CURP', url: null },
    { type: 'RFC', url: null },
    { type: 'NSS', url: null },
    { type: 'Último comprobante de estudios', url: null },
    { type: 'Cuenta bancaria', url: null },
    { type: 'Documento de descuento', url: null },
  ];

  constructor(
    private route: ActivatedRoute,
    private employeesService: EmployeesService,
    private toastController: ToastController
  ) {}

  ngOnInit(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id') || '';
    this.loadEmployeeDetails();
    this.loadDocuments();
  }

  loadEmployeeDetails(): void {
    this.employeesService.getEmployeeById(this.employeeId).subscribe({
      next: (data) => (this.employeeName = `${data.name} ${data.last_name}`),
      error: () => this.presentToast('Error al cargar detalles del empleado', 'danger'),
    });
  }

  loadDocuments(): void {
    this.employeesService.getEmployeeDocuments(this.employeeId).subscribe({
      next: (data) => {
        for (const doc of this.documents) {
          const uploadedDoc = data.find((d: any) => d.type === doc.type);
          if (uploadedDoc) {
            doc.url = uploadedDoc.url;
          } else {
            doc.url = null; // Si no hay documento, limpiar la URL
          }
        }
      },
      error: () => this.presentToast('Error al cargar documentos', 'danger'),
    });
  }

  onFileSelected(event: Event, type: string): void {
    const input = event.target as HTMLInputElement;

    if (input?.files?.length) {
      const file = input.files[0];
      this.employeesService.uploadEmployeeDocument(this.employeeId, file, type).subscribe({
        next: () => {
          this.presentToast(`Documento ${type} subido con éxito.`);
          this.loadDocuments(); // Recargar los documentos
        },
        error: () => this.presentToast('Error al subir documento', 'danger'),
      });
    }
  }

  deleteDocument(type: string): void {
    this.employeesService.deleteEmployeeDocument(this.employeeId, type).subscribe({
      next: () => {
        this.presentToast(`Documento ${type} eliminado con éxito.`);
        this.loadDocuments(); // Recargar los documentos
      },
      error: () => this.presentToast('Error al eliminar documento', 'danger'),
    });
  }

  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      color,
      duration: 3000,
    });
    await toast.present();
  }
}
