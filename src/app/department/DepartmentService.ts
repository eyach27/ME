import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from './departement';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private baseUrl = API+'api/departments';

  constructor(private http: HttpClient) { }

  getAllDepartments(): Observable<any> {
    return this.http.get(this.baseUrl);
  }
  getDepartments(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateDepartment(id: number, departement: Department): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`,departement);
  }

  deleteDepartment(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  createDepartment(departmentName:Department): Observable<any> {
    return this.http.post(this.baseUrl, departmentName);
  }
}
