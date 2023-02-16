import { Component, OnInit } from '@angular/core';
import { Vehicle } from 'src/app/models/parking.model';
import { ParkingService } from 'src/app/services/parking.service';

enum Responses {
  OK = 'vehicle saved',
  EXISTS = 'vehicle already exists',
  FAILED = 'save failed',
  ALREADY_PARKED = 'vehicle already parked',
  RECORD_FAILED = 'save failed',
  RECORD_CREATED = 'record created',
  VEHICLE_NOT_FOUND = 'vehicle not found',
  VEHICLE_NOT_PARKED = 'vehicle is not parked',
  UPDATE_SUCCESS = 'update success',
  UPDATE_NOT_FOUND = 'update not found',
  UPDATE_FAILED = 'update failed',
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
        this.createRecord(plate);
        this.showType = false;
        this.isDisabled = true;
        this.typeButton = 1;
        this.generateMessage('New vehicle saved and parked');
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
      console.log('this.record', this.records);
      
      const record = this.records.find(vehicle => vehicle.vehicleId.plate === this.plate);
      if (vehicle) {
        this.typeButton = 2;
        this.isDisabled = false;
        this.showType = false;
      } else {
        this.showType = true;
        this.isDisabled = false;
        this.typeButton = 1;
      }

      if (record) {
        this.typeButton = 3;
        this.isDisabled = false;
        this.showType = false;
        this.generateMessage('Vehicle already parked');
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

  createRecord(plate: string): void {
    this.parkingService.createRecord(plate).subscribe((data) => {
      if (data === Responses.RECORD_CREATED) {
        this.generateMessage('Record created');
        this.plate = '';
        this.isDisabled = true;
        this.getRecords();
        this.parkingService.option = 2;
      } else if (data === Responses.ALREADY_PARKED) {
        this.generateMessage('Vehicle already parked');
      } else if (data === Responses.RECORD_FAILED) {
        this.generateMessage('Save failed');
      } else if (data === Responses.VEHICLE_NOT_FOUND) {
        this.generateMessage('Vehicle not found');
      }
    });
  }

  updateRecord(id: string): void {
    this.parkingService.updateRecord(id).subscribe((data) => {
      if (data === Responses.UPDATE_SUCCESS) {
        this.generateMessage('Update success');
        this.getRecords();
        this.plate = '';
        this.typeButton = 1;
      } else if (data === Responses.VEHICLE_NOT_PARKED) {
        this.generateMessage('Vehicle is not parked');
      } else if (data === Responses.UPDATE_NOT_FOUND) {
        this.generateMessage('Update not found');
      } else if (data === Responses.UPDATE_FAILED) {
        this.generateMessage('update failed');
      }
    });
  }

  deleteRecord(plate: string): void {
    const newVehicleId = (this.records.find((record) => record.vehicleId.plate === plate)).id;

    this.parkingService.updateRecord(newVehicleId).subscribe((data) => {
      if (data === Responses.UPDATE_SUCCESS) {
        this.generateMessage('Update success');
        this.getRecords();
        this.plate = '';
        this.typeButton = 1;
        this.isDisabled = true;
      } else if (data === Responses.VEHICLE_NOT_PARKED) {
        this.generateMessage('Vehicle is not parked');
      } else if (data === Responses.UPDATE_NOT_FOUND) {
        this.generateMessage('Update not found');
      } else if (data === Responses.UPDATE_FAILED) {
        this.generateMessage('update failed');
      }
    });
  }
}
