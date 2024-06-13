import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, map } from 'rxjs';
import { Lot } from './lot';

const API = `${environment.apiBaseUrl }`;

@Injectable({
  providedIn: 'root'
})
export class gestionLotService {

  private baseUrl = API+'api/lot';

  constructor(private http: HttpClient) { }
  getListLot(): Observable<Lot[]> {
   return this.http.get(`${this.baseUrl}/listLot`).pipe(
    map((lots: Lot[]) => {
      return lots;
    })
  );
  }

getLotById(id:number): Observable<Lot> {

return this.http.get(`${this.baseUrl}/${id}`).pipe(

map((lots: Lot) => {

return lots;

})

);

}
planifierLot(formData: any): Observable<any> {

  const { name, IDformationsPlan, IDparticipants, departements } = formData;
 
 
 
 
const params = new HttpParams()
 

 
  .set('name', name)
 
 .set('IDformationsPlan', IDformationsPlan)//set <long>
 
.set('IDparticipants', IDparticipants)
 
.set('departements', departements); //set <String>: les nomes des departements
 
 
 
 
  return this.http.post(`${this.baseUrl}/creat`, null, { params });
 
 }

deleteLot(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
}
removePlanning(idPlan: number, idLot: number): Observable<any> {
  return this.http.put(`${this.baseUrl}/remove/${idPlan}/plan-lot/${idLot}`, { responseType: 'text' });
}
UpdateLot(body: any, id_lot: number): Observable<any> {

 const { name, IDparticipants, departements } = body;

 const params = {
name: name,
IDparticipants: IDparticipants.join(','),
 departements: departements.join(',')
};
return this.http.put(`${this.baseUrl}/update/${id_lot}`, null, { params });
  }
  addNewPlanning(formData: any): Observable<any> {
    const {lotId, nameFormation, idFormateur, heure_date_Debut, heure_date_Fin, repeterChaque, description, salle,enLigne, jourSemaine,
      idParticipants, idDocuments, idDepartements,TypePlan } = formData;
  
  const params = new HttpParams()
  .set('lotId', lotId)
    .set('jourSemaine', jourSemaine)
    .set('heure_date_Debut', heure_date_Debut)
    .set('heure_date_Fin', heure_date_Fin)
    .set('repeterChaque', repeterChaque)
    .set('nameFormation', nameFormation)
    .set('idFormateur', idFormateur)
    .set('description', description)
    .set('salle', salle)
    .set('enLigne', enLigne)
    .set('idParticipants',idParticipants)
    .set('idDocuments', idDocuments)
    .set('idDepartements', idDepartements)
    .set('TypePlan', TypePlan);
  
  return this.http.put(`${this.baseUrl}/newPlanning/${lotId}`, null, { params });
  } 
}