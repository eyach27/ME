import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostBinding, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GestionDocService } from 'src/app/GestionDoc/gestion-doc.service';
import { User } from 'src/app/GestionUser/user';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { DepartmentService } from 'src/app/department/DepartmentService';
import { ThemeService } from 'src/app/theme.service';
import { FormationPlan } from '../FormationPlan';
import { gestionPlanService } from '../gestion-plan.service';
import { Observable, concat, forkJoin, map } from 'rxjs';
import { Document } from 'src/app/GestionDoc/document';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import { EventInput } from '@fullcalendar/core';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

const API = `${environment.apiBaseUrl }`;
@Component({
  selector: 'app-mesformations',
  templateUrl: './mesformations.component.html',
  styleUrls: ['./mesformations.component.scss']
})
export class MesformationsComponent implements OnInit {
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin],
    events: [],
    locale: moment.locale('fr'), // définit la locale de moment.js en français
    buttonText: {
      today: 'Aujourd\'hui'
    }
  };
  @ViewChild("inputElement",{static:true}) inputElement : ElementRef<HTMLInputElement>;
  @HostBinding('class') componentClass = 'light';
  @ViewChild('content') templateRef: TemplateRef<any>;
  showuser:boolean=false;
  showformation:boolean=true;
  currentIconClass='bx bx-low-vision';
  closeResult: string;
  OpenCalender: boolean=true;
  showformationd: boolean=false;
  showformations:boolean=false;


columnHeadersDispense = [
    {name: 'Nom', width: '20%'},
    {name: 'Date de début', width: '20%'},
    {name: 'Date limite', width: '20%'},
    {name: 'Participants', width: '10%'},
    {name: 'Localisation', width: '20%'},
    {name: 'Action', width: '10%'}
  ];
  
  columnHeadersSuivies = [
    {name: 'Nom', width: '20%'},
    {name: 'Date de début', width: '20%'},
    {name: 'Date limite', width: '20%'},
    {name: 'Formateur', width: '10%'},
    {name: 'Localisation', width: '20%'},
    {name: 'Action', width: '10%'}
  ];
  
  columnHeaders = this.columnHeadersDispense;
  filterValue: string;
  filtredList: any;
  constructor(private departementService:DepartmentService ,private userservice:UserServiceGestService,private httpClient: HttpClient,private route: ActivatedRoute,
     private gestionDocService: GestionDocService,private router: Router,private modalService: NgbModal, 
     private tokenStorageService : TokenStorageService,private userService: UserServiceGestService ,private sanitizer: DomSanitizer,
    private themeService: ThemeService ,private gestionPlanService : gestionPlanService) 
    {  this.themeService.observeMode().subscribe(mode => {
     this.componentClass = mode;});}
      
     isLoggedIn = false;
     showAdminBoard:boolean;
     showUserboard:boolean;
     showFormboard:boolean;
     user:Observable<any>;
     IdUser: number;
     planningList: FormationPlan[] = [];
     typeList:String="Dispense";
     SelectedPlan:FormationPlan;
     SelectedDocs:Document[]
     //intervals: Set<Date[]>;
     intervals: Date[][] = [];
     ngOnInit() {
      if (this.tokenStorageService.getToken()) {
        this.isLoggedIn = true;
        this.getActivatedUser();
        this.userService.getUser(this.IdUser);
        this.showAdminBoard=this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN');
        this.showUserboard=this.tokenStorageService.getUser().roles.includes('ROLE_USER');
        this.showFormboard=this.tokenStorageService.getUser().roles.includes('ROLE_FORMATEUR')
      }
     
       
     
    }
    
    users: any;
    
    getActivatedUser() {
      this.userService.getUserList().subscribe(data => {
        this.users = data;
        console.log(this.tokenStorageService.getId());
        console.log(this.users.length);
        for(let aU of this.users){
          if(aU.id === this.tokenStorageService.getId()){
            this.user = aU;
            this.IdUser=aU.id;
            this.reloadData(this.IdUser);
            break;
          }
        }
        // Call reloadData here
     //   this.reloadData(this.IdUser);
      });
    }
    
    reloadData(idUser: number) {
      const listD: Observable<FormationPlan[]> = this.gestionPlanService.getPlanningListD(idUser).pipe(
        map(plans => plans.map(plan => ({ ...plan, planningType: 'D' })))
        
      );
      
      const listS: Observable<FormationPlan[]> = this.gestionPlanService.getPlanningListS(idUser).pipe(
        map(plans => plans.map(plan => ({ ...plan, planningType: 'S' })))
      );
    
      forkJoin([listD, listS]).subscribe((results: [FormationPlan[], FormationPlan[]]) => {
        const mergedList: FormationPlan[] = [...results[0], ...results[1]];
        const observables = mergedList.map(planning => {
          return this.gestionPlanService.getIntervalle(planning.id).pipe(
            map(intervalsSet => {
              const intervals = Array.from(intervalsSet).sort((a, b) => a[0].getTime() - b[0].getTime());
              return intervals.map(session => {
                return {
                  title: planning.formation.name,
                  start: session[0],
                  end: session[1],
                  className: planning.planningType === 'S' ? 's-planning' : 'd-planning'
                };
              });
            })
          );
        });
        forkJoin(observables).subscribe(events => {
          const flattenedEvents = events.reduce((acc, val) => acc.concat(val), []);
          this.calendarOptions.events = flattenedEvents;
        });
      });
    }
    
    /*formatEvents(planningList: FormationPlan[]): EventInput[] {
      console.log("test event ")
      const events: EventInput[] = [];
      planningList.forEach(planning => {
        this.gestionPlanService.getIntervalle(planning.id).subscribe((intervalsSet) => {
          this.intervals = Array.from(intervalsSet).sort((a, b) => a[0].getTime() - b[0].getTime());
          // After all the data has been loaded, add the events to the calendar
          this.intervals.forEach(session => {
            events.push({
              title: planning.formation.name,
              start: session[0],
              end: session[1]
            }); 
          });
          this.calendarOptions.events = events;
          console.log(events)
        });
      });
      
      return events;
    }*/
setLocalisations(): void {
  this.planningList.forEach(plan => {
    if (plan.enLigne && plan.salle) {
      plan.localisation = 'En Ligne - Presentielle : ' + plan.salle;
    } else if (plan.enLigne) {
      plan.localisation = 'En Ligne';
    } else if (plan.salle) {
      plan.localisation = 'Presentielle : ' + plan.salle;
    } else {
      plan.localisation = 'NON INDIQUEE';
    }
  });
}
/*ChangeTypeList(type: string) {

  if (type === 'Dispense') {
    this.typeList=type;
  this.columnHeaders = this.columnHeadersDispense;
  
  } else if (type === 'Suivies') {
    this.columnHeaders = this.columnHeadersSuivies;
   this.typeList=type;
  }
  this.reloadData(this.IdUser,this.typeList);
}*/
  


 /* CETTE FONCTION C EST POUR VIEW icon*/
 toggleIcon1() {
  if (this.currentIconClass =='bx bx-low-vision') {
    this.currentIconClass  = 'bx bx-show-alt';
  } else {
    this.currentIconClass = 'bx bx-low-vision';
  }
}



opendetailsform(contentdetailform,plan: FormationPlan){

  this.gestionPlanService.getIntervalle(plan.id).subscribe((intervalsSet) => {
    this.intervals = Array.from(intervalsSet).sort((a, b) => a[0].getTime() - b[0].getTime());
  });
  this.SelectedPlan=plan;
 this.SelectedPlan.participants.map(user => {

 user.p = '../../assets/images/photoParDefaut.jpg';
    
   if (user.photo) {
    
  const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
    
   //console.log(fileName); // Output: "nom.png"

  user.p = API + 'api/gestion/PDP/' + fileName;
    
 }
    
 return user;
})
this.SelectedDocs=plan.documents;
console.log(this.SelectedDocs)
  this.modalService.open(contentdetailform, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {  
    this.currentIconClass = 'bx bx-low-vision';
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
  });  

}

private getDismissReason(reason: any): string { 
 
  if (reason === ModalDismissReasons.ESC) { 
    return 'by pressing ESC';  
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {  
    return 'by clicking on a backdrop';  
  } else {    
    return `with: ${reason}`;  
  }  
}  
download(id:number,titre : string) {
  this.gestionDocService.downloadDocc(id)
    .subscribe(
      data => {
      let fileName=titre;
      console.log(fileName);
        let blob:Blob=data.body as Blob;
        let a = document.createElement('a');
        a.download=fileName;
        a.href=window.URL.createObjectURL(blob);
        a.click();
      },
      error => console.log(error));
}
handleDateClick(arg) {
  alert('date click! ' + arg.dateStr)
}
OpenCalendar(){
  this.OpenCalender=true;
  this.showformationd=false;
  this.showformations=false;
  
}
showformationD(){
  this.showformationd=true;
  this.showformations=false;
  this.OpenCalender=false;
  this.columnHeaders = this.columnHeadersDispense;
  this.gestionPlanService.getPlanningListD(this.IdUser)
  .subscribe((plannings: FormationPlan[]) => {
    this.planningList = plannings;
    this.setLocalisations();
  });

}
showformationS(){
  this.showformationd=false;
  this.showformations=true;
  this.OpenCalender=false;
  this.columnHeaders = this.columnHeadersSuivies;
  this.gestionPlanService.getPlanningListS(this.IdUser)
  .subscribe((plannings: FormationPlan[]) => {
    this.planningList = plannings;
    this.setLocalisations();
  });
}
applyFilter() {
  const filter = this.filterValue.toLowerCase();
  this.planningList = this.filtredList.filter(plan =>
    plan.formation.name.toLowerCase().includes(filter) ||
    plan.formateur.username.toLowerCase().includes(filter) ||
    plan.startDate.toString().toLowerCase().includes(filter) ||
    plan.endDate.toString().toLowerCase().includes(filter)
  );
}
}