import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/vehicle.model';
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
  typeButton: number = 1;
  showType = false;
  vehicles: Vehicle[] = [];

  get option(): number {
    return this.parkingService.option;
  }

  constructor(private parkingService: ParkingService) {}

  ngOnInit(): void {
    this.getRecords();
    this.getVehicles();
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
      this.isDisabled = true;
      this.typeButton = 1;
      this.showType = false;
      this.generateMessage('Plate must have 6 characters');
    } else {
      // Validate if my plate is in the array of vehicles
      const vehicle = this.vehicles.find(
        (vehicle) => vehicle.plate === this.plate
      );
      if (vehicle) {
        this.typeButton = 2;
        this.isDisabled = false;
        this.showType = false;
      } else {
        this.showType = true;
        this.isDisabled = false;
        this.typeButton = 1;
      }
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

  getVehicles(): void {
    this.parkingService.getVehicle().subscribe((data) => {
      this.vehicles = data;
    });
  }

  createRecord(plate: string): void {}
}
