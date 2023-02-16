import { Component, OnInit } from '@angular/core';
import { ParkingService } from 'src/app/services/parking.service';

enum Responses {
  OK = 'vehicle saved',
  EXISTS = 'vehicle already exists',
  FAILED = 'save failed',
}

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss'],
})
export class ViewComponent implements OnInit {
  plate: string = '';
  type: string = 'carro';
  message: string = '';
  isDisabled = true;
  records: any[] = [];
  optionsType: string[] = ['carro', 'moto'];

  get option(): number {
    return this.parkingService.option;
  }

  constructor(private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.getRecords();
  }

  registerVehicle(plate: string, type: string): void {
    this.parkingService.registerVehicle(plate, type).subscribe((data) => {
      if (data === Responses.OK) {
        this.plate = '';
        this.generateMessage('Vehicle saved');
      } else if (data === Responses.EXISTS) {
        this.generateMessage('Vehicle already exists');
      } else if (data === Responses.FAILED) {
        this.generateMessage('Save failed');
      }
    });
  }

  onKey(event: any): void {
    let length = event.target.value.length;
    if (length !== 6) {
      this.generateMessage('Plate must have 6 characters');
    } else {
      this.isDisabled = false;
    }
  }

  generateMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  getRecords(): void {
    this.parkingService.getRecords().subscribe((data) => {
      this.records = data.filter((record) => record.parked === true);
    });
  }
}
