import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Formation } from './formation';
const API = `${environment.apiBaseUrl }`;

@Injectable({
  providedIn: 'root'
})
export class gestionFormService {

  private baseUrl = API+'api/formations';

  constructor(private http: HttpClient) { }

  createForm(formation: Object): Observable<Formation> {

    return this.http.post<Formation>(`${this.baseUrl}/create`, formation);
  }

  getListForm(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }


  deleteForm(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

  
 updateForm(id: number, value: any): Observable<Object> {
  return this.http.put(`${this.baseUrl}/update/${id}`, value);
  }

getForm(id: number): Observable<any> {
  return this.http.get(`${this.baseUrl}/${id}`);
  }
getFormationByName(name: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetByName/${name}`);
    }
  
}