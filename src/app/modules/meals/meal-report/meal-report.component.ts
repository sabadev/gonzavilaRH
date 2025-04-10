import { Component } from '@angular/core';
import { MealsService } from 'src/app/services/meals.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-meal-report',
  templateUrl: './meal-report.component.html',
  styleUrls: ['./meal-report.component.scss']
})
export class MealReportComponent {
  reportType: 'daily' | 'range' = 'range'; // Tipo de reporte
  startDate: string = '';
  endDate: string = '';
  date: string = ''; // Fecha específica para el reporte diario
  report: any[] = [];
  dailyDetails: any[] = []; // Detalles del reporte diario
  dailySummary: any[] = []; // Resumen del reporte diario

  constructor(private mealsService: MealsService, private toastController: ToastController) {}

  generateReport() {
    if (this.reportType === 'range') {
      this.generateRangeReport();
    } else if (this.reportType === 'daily') {
      this.generateDailyReport();
    }
  }

  generateRangeReport() {

  }


  generateDailyReport() {
    if (this.date) {
      const processedDate = this.date.split('T')[0]; // Tomar solo la parte YYYY-MM-DD
      this.mealsService.getDailyMealReport(processedDate).subscribe(
        (response) => {
          this.dailyDetails = response.details;
          this.dailySummary = response.summary;
          console.log('Reporte diario generado:', response);
        },
        (error) => {
          console.error('Error al generar el reporte diario:', error);
          this.presentToast('Error al generar el reporte diario', 'danger');
        }
      );
    } else {
      this.presentToast('Por favor selecciona una fecha', 'danger');
    }
  }


  async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
}
