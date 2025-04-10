export interface Payroll {
  id?: number; // Hacer 'id' opcional
  period: string;
  start_date: string;
  end_date: string;
}
export interface Employee {
  id: number;
  name: string;
  last_name: string;
  position: string;
  base_salary: number;
  bonuses: number;
  discounts: number;
}
