import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PayrollsService } from 'src/app/services/payrolls.service';
import { Payroll } from 'src/app/models/employees.interface';

@Component({
  selector: 'app-create-payroll',
  templateUrl: './create-payroll.component.html',
  styleUrls: ['./create-payroll.component.scss'],
})
export class CreatePayrollComponent {
  payroll: Partial<Payroll> = {
    period: '',
    start_date: '',
    end_date: '',
  };

  constructor(private payrollService: PayrollsService, private router: Router) {}

  createPayroll(): void {
    const { id, ...payrollData } = this.payroll; // Excluir 'id' al enviar datos
    this.payrollService.createPayroll(payrollData).subscribe({
      next: (response) => {
        console.log('Nómina creada exitosamente:', response);
        this.router.navigate(['/payrolls']);
      },
      error: (error) => {
        console.error('Error al crear nómina:', error);
      },
    });
  }
}
