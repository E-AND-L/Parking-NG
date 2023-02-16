import { Component } from '@angular/core';
import { ParkingService } from 'src/app/services/parking.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  constructor(private parkingService: ParkingService) { }

  changeView(view: number): void {
    this.parkingService.option = view;
  }
}
