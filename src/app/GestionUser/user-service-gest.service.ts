import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;

@Injectable({
  providedIn: 'root'
})
export class UserServiceGestService {

  private baseUrl = API+'api/gestion/users';

  constructor(private http: HttpClient) { }

  getUser(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createUser(user: Object): Observable<Object> {
    return this.http.post(`${this.baseUrl}`, user);
  }

  updateUser(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/${id}`, value);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  acceptUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/accept/${id}`, { responseType: 'text' });
  }

  acceptAllUsers(): Observable<any> {
    return this.http.put(`${this.baseUrl}/accept/all`, { responseType: 'text' });
  }

  getUserList(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getUserListEnattente(): Observable<any> {
    return this.http.get(`${this.baseUrl}/enattente`);
  }

  registerAdmin(firstname:string,lastname:string, username: string, email: string, password: string,poste:string,role:Set<String> ): Observable<any> {
    return this.http.post(`${this.baseUrl}/admin`, {firstname,lastname, username,email,password,poste,role});
  }
 
  getProfilePhotoByname(titre: string): Observable<any> {
      return this.http.get(API+`api/gestion/PDP/${titre}`);
    }

  desactivateUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/desactive/${id}`, { responseType: 'text' });
  }
  activateUser(id: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/active/${id}`, { responseType: 'text' });
  }
}

