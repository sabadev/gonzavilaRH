import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { AreaService } from 'src/app/services/area.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-area-list-popover',
  templateUrl: './area-list-popover.component.html',
  styleUrls: ['./area-list-popover.component.scss'],
})
export class AreaListPopoverComponent implements OnInit {
  areas: any[] = [];
  isLoading = true;
  errorLoading = false;
  searchTerm = '';

  constructor(
    private popoverController: PopoverController,
    private areaService: AreaService
  ) {}

  ngOnInit(): void {
    this.loadAreas();
  }

  loadAreas(): void {
    this.isLoading = true;
    this.errorLoading = false;

    this.areaService.getAreas()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (areas: any[]) => {
          this.areas = areas;
        },
        error: (err) => {
          console.error('Error loading areas:', err);
          this.errorLoading = true;
        }
      });
  }

  searchAreas(event: any): void {
    this.searchTerm = event.target.value.toLowerCase();
  }

  get filteredAreas(): any[] {
    return this.areas.filter(area =>
      area.name.toLowerCase().includes(this.searchTerm)
    );
  }

  selectArea(area: any): void {
    this.popoverController.dismiss({
      areaSelected: area,
    });
  }

  dismiss(): void {
    this.popoverController.dismiss();
  }
}
