import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ParkingService {
  private _option = 2;
  private apiUrl: string = 'http://localhost:8080';

  get option(): number {
    return this._option;
  }

  set option(value: number) {
    this._option = value;
  }

  constructor(private http: HttpClient) {}

  getRecords(): Observable<any[]> {
    const url = `${this.apiUrl}/api/records`;
    return this.http.get<any[]>(url);
  }

  registerVehicle(plate: string, type: string): Observable<string> {
    const url = `${this.apiUrl}/api/vehicles`;
    return this.http.post<string>(
      url,
      { plate, type },
      { responseType: 'text' as 'json' }
    );
  }
}
