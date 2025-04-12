import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayrollsService } from 'src/app/services/payrolls.service';

@Component({
  selector: 'app-payroll-detail',
  templateUrl: './payroll-detail.component.html',
  styleUrls: ['./payroll-detail.component.scss']
})
export class PayrollDetailsComponent implements OnInit {
  employees: any[] = [];
  payrollId!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private payrollsService: PayrollsService
  ) {}

  ngOnInit(): void {
    this.payrollId = +this.route.snapshot.paramMap.get('id')!;
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.payrollsService.getPayrollEmployees(this.payrollId).subscribe({
      next: (data) => {
        this.employees = data;
      },
      error: (error) => {
        console.error('Error al cargar empleados:', error);
      }
    });
  }

  viewEmployee(employeeId: number): void {
    this.router.navigate(['/payrolls/movements', this.payrollId, employeeId]);
  }

  goBack(): void {
    this.router.navigate(['/payrolls']);
  }
}
