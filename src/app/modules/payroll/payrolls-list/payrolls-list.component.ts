import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollsService } from 'src/app/services/payrolls.service';

@Component({
  selector: 'app-payrolls-list',
  templateUrl: './payrolls-list.component.html',
  styleUrls: ['./payrolls-list.component.scss'],
})
export class PayrollsListComponent implements OnInit {
  payrolls: any[] = [];

  constructor(private payrollsService: PayrollsService, private router: Router) {}

  ngOnInit(): void {
    this.loadPayrolls();
  }

  loadPayrolls(): void {
    this.payrollsService.getPayrolls().subscribe({
      next: (data) => {
        this.payrolls = data;
      },
      error: (error) => {
        console.error('Error al cargar nóminas:', error);
      },
    });
  }

  viewDetails(payrollId: number): void {
    this.router.navigate(['/payrolls/details', payrollId]);
  }

  createPayroll(): void {
    this.router.navigate(['/payrolls/create']);
  }
  deletePayroll(payrollId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta nómina?')) {
      this.payrollsService.deletePayroll(payrollId).subscribe({
        next: () => {
          // Filtra la nómina eliminada de la lista actual
          this.payrolls = this.payrolls.filter((payroll) => payroll.id !== payrollId);
          console.log(`Nómina con ID ${payrollId} eliminada exitosamente.`);
        },
        error: (err) => {
          console.error('Error al eliminar la nómina:', err);
        },
      });
    }
  }
}
