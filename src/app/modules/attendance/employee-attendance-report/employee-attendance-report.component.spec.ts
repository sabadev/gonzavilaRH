import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EmployeeAttendanceReportComponent } from './employee-attendance-report.component';

describe('EmployeeAttendanceReportComponent', () => {
  let component: EmployeeAttendanceReportComponent;
  let fixture: ComponentFixture<EmployeeAttendanceReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeAttendanceReportComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeAttendanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
