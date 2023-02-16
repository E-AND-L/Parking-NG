export interface Record {
  id:        number;
  entryDate: Date;
  exitDate:  null;
  parked:    boolean;
  vehicleId: Vehicle;
}

export interface Vehicle {
  id:    number;
  plate: string;
  type:  string;
}
