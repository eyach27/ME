import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, catchError, forkJoin, map, pipe, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Formation } from './formation';
import { FormationPlan } from './FormationPlan';
const API = `${environment.apiBaseUrl }`;


@Injectable({
  providedIn: 'root'
})
export class gestionPlanService {

  private baseUrl = API+'api/planning';

  constructor(private http: HttpClient) { }
  checkDispo(formData: any): Observable<any> {
    const { idFormateur, TypePlan, jourSemaine, heure_date_Debut, heure_date_Fin, repeterChaque } = formData;
  
    const params = new HttpParams()
      .set('TypePlan', TypePlan)
      .set('jourSemaine', jourSemaine)
      .set('heure_date_Debut', heure_date_Debut)
      .set('heure_date_Fin', heure_date_Fin)
      .set('repeterChaque', repeterChaque);
  
    return this.http.post(`${this.baseUrl}/formateur/${idFormateur}/disponibilite`, null, { params });
  }


  planifierFormationParSemaine(formData: any): Observable<any> {
    const { nameFormation, idFormateur, heure_date_Debut, heure_date_Fin, repeterChaque, description, salle,enLigne, jourSemaine,
        idParticipants, idDocuments, idDepartements } = formData;
  
    const params = new HttpParams()
      
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
      .set('idDepartements', idDepartements);
  
    return this.http.post(`${this.baseUrl}/plan-semaine`, null, { params });
  }
  

  planifierFormationParJour(formData: any): Observable<any> {
    const {nameFormation, idFormateur, heure_date_Debut, heure_date_Fin, repeterChaque, description, salle,enLigne,
       idParticipants, idDocuments, idDepartements} = formData;
  
    const params = new HttpParams()
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
      .set('idDepartements', idDepartements);
  
    return this.http.post(`${this.baseUrl}/plan-jour`, null, { params });
  } 

  getListPlanningByName(nomFomration:string): Observable<any> {
    return this.http.get(`${this.baseUrl}/list/${nomFomration}`);
  }
  getListPlanningById(idFomration:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/listBYid/${idFomration}`);
  }

  //Dispense: le user est un formateur 
  getPlanningListD(IdUser:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/listD/${IdUser}`);
  }

 //Suivies: le User est un participant 
 getPlanningListS(IdUser: number): Observable<FormationPlan[]> {
  return this.http.get(`${this.baseUrl}/listS/${IdUser}`).pipe(
    map((formations: FormationPlan[]) => {
      return formations;
    })
  );
}


getIntervalle(IDplanning: number): Observable<Set<Date[]>> {
  return this.http.get(`${this.baseUrl}/intervalle/${IDplanning}`).pipe(
    map((response: any) => {
      const intervals: Set<Date[]> = new Set(response.map((dateArray: any[]) => {
        return dateArray.map((dateString: string) => new Date(dateString));
      }));
      return intervals;
    })
  );
}

getAll(): Observable<FormationPlan[]> {
  return this.http.get(`${this.baseUrl}/All/`).pipe(
    map((formations: FormationPlan[]) => {
      return formations;
    })
  );
}

getPlanningNotExpedited(): Observable<FormationPlan[]> {
  return this.http.get(`${this.baseUrl}/PlanningNotExpedited`).pipe(
    map((formations: FormationPlan[]) => {
      // Trier par ordre croissant de la date de début
      formations.sort((a, b) => {
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateA.getTime() - dateB.getTime();
      });
   
      return formations;
    })
  );
}


getById(id : number): Observable<FormationPlan> {
  return this.http.get(`${this.baseUrl}/${id}/`).pipe(
    map((formation: FormationPlan) => {
      return formation;
    })
  );
}


 // Returns a list of Formation objects that correspond to the non-assigned FormationPlan objects
 getListFormationNonAssignees(): Observable<FormationPlan[]> {
  return this.http.get(`${this.baseUrl}/planningNonAssignees/`).pipe(
    map((formations: FormationPlan[]) => {
      return formations;
    })
  );
}



getUnassignedPlans(): Observable<FormationPlan[]> {
  // Combine the results of getAll() and getListPlanFormationNonAssignees()
  return forkJoin({
    allPlans: this.getAll(),
    unassignedPlans: this.getListFormationNonAssignees()
  }).pipe(
    map(({ allPlans, unassignedPlans }) => {
      // Filter the combined list based on the value of type
      return allPlans.filter(plan => {
        if (unassignedPlans.find(unassignedPlan => unassignedPlan.id === plan.id)) {
          // If the plan is unassigned, set its type to 'formation'
          return plan.type = 'formation';
        } else {
          // Otherwise, set its type to 'lot'
          return plan.type = 'lot';
        }
      });
    })
  );
}

deletePlan(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/delete/${id}`, { responseType: 'text' });
}
deleteParticipationFromPlanning(id_planification: number,id_participant:number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/${id_planification}/participants/${id_participant}`, { responseType: 'text' });
}
deleteParticipationFromAllPlanning(id: number): Observable<any> {
  return this.http.delete(`${this.baseUrl}/participants/${id}`, { responseType: 'text' });
}

UpdatePlan(formData: any): Observable<any> {
  const {idPlan ,nameFormation, idFormateur, heure_date_Debut, heure_date_Fin, repeterChaque,TypePlan, description, salle,enLigne, jourSemaine,
      idParticipants, idDocuments, idDepartements } = formData;

  const params = new HttpParams()
    .set('idPlan',idPlan)
    .set('jourSemaine', jourSemaine)
    .set('heure_date_Debut', heure_date_Debut)
    .set('heure_date_Fin', heure_date_Fin)
    .set('repeterChaque', repeterChaque)
    .set('nameFormation', nameFormation)
    .set('idFormateur', idFormateur)
    .set('TypePlan',TypePlan)
    .set('description', description)
    .set('salle', salle)
    .set('enLigne', enLigne)
    .set('idParticipants',idParticipants)
    .set('idDocuments', idDocuments)
    .set('idDepartements', idDepartements);

  return this.http.post(`${this.baseUrl}/planUpdate`, null, { params });
}

 }

function moment(startDate: string) {
  throw new Error('Function not implemented.');
}
