import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { AuthModule } from './modules/auth/auth.module';

const routes: Routes = [
  {
    path: 'payrolls',
    loadChildren: () =>
      import('./modules/payroll/payroll.module').then((m) => m.PayrollModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard/dashboard.module').then(
        (m) => m.DashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./modules/employees/employees.module').then(
        (m) => m.EmployeesModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'recruitment',
    loadChildren: () =>
      import('./modules/recruitment/recruitment.module').then(
        (m) => m.RecruitmentModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./modules/attendance/attendance.module').then(
        (m) => m.AttendanceModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'leaves',
    loadChildren: () =>
      import('./modules/leaves/leaves.module').then((m) => m.LeavesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'meals',
    loadChildren: () =>
      import('./modules/meals/meals.module').then((m) => m.MealsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'assets',
    loadChildren: () =>
      import('./modules/assets/assets.module').then((m) => m.AssetsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./modules/reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'organigram',
    loadChildren: () =>
      import('./modules/organigram/organigram.module').then(
        (m) => m.OrganigramModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./modules/settings/settings.module').then(
        (m) => m.SettingsModule
      ),
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }, // Manejo de rutas no encontradas
];

@NgModule({
  imports: [
    AuthModule,
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
