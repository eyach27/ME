import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../GestionUser/user';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;


@Injectable({
  providedIn: 'root'
})
export class GestionDocService {
  private baseUrl = API+'document';

  constructor(private http: HttpClient) { }

  uploadDoc(document: Object,tags:Set<String>): Observable<Object> {
    return this.http.post(`${this.baseUrl}/upload`, {document,tags});
  }
  getDocList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/list`);
  }
  getDocByTit(titre:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recherche/titre/${titre}`);
  }
  getDocByType(type:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recherche/type/${type}`);
  }
  getDocByDep(dep:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recherche/dep/${dep}`);
  }
  getDocListByDep(dep:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAll/inDep/${dep}`);
  }
  getDocByTag(tag:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/recherche/tag/${tag}`);
  }

  getDocListFav(id: number): Observable<any> {
    return this.http.get(API+`api/favorite/doc/${id}`);
  }

  deleteDoc(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
  }

 updateDoc(id: number, value: any): Observable<Object> {
    return this.http.put(`${this.baseUrl}/update/${id}`, value);
  }

  getDoc(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  getDocByName(titre: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/name/${titre}`);
  }

  downloadDoc(titre:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/download/${titre}`,{observe:'response',responseType:'blob'});
  }

  downloadDocc(id:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/download/${id}`,{observe:'response',responseType:'blob'});
  }

  RemoveFromFav(idu:number,idd:number): Observable<Object> {
    return this.http.delete(API + `api/favorite/doc/${idu}/${idd}`, { responseType: 'text' });}
 
    ToFav(idu: number , fav: any[]): Observable<Object> {
      return this.http.put(API +`api/favorite/doc/${idu}`,{fav}, { responseType: 'text' });}
      
      getDepartementsByDocId(id: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/${id}/departments`);
      }

}


