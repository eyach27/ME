import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Department } from 'src/app/department/departement';
import { GestionDocService } from 'src/app/GestionDoc/gestion-doc.service';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { User } from 'src/app/GestionUser/user';
import { environment } from 'src/environments/environment';
import { FormationPlan } from '../FormationPlan';
import { gestionPlanService } from '../gestion-plan.service';
import { Document } from 'src/app/GestionDoc/document';
import { Lot } from '../lot';
import { gestionLotService } from '../gestion-lot.service';
const API = `${environment.apiBaseUrl }`;

@Component({
  selector: 'app-detail-lot',
  templateUrl: './detail-lot.component.html',
  styleUrls: ['./detail-lot.component.scss']
})
export class DetailLotComponent implements OnInit {
  @ViewChild('content') templateRef: TemplateRef<any>;
  showuser:boolean=false;
  showformation:boolean=true;
  currentIconClass='bx bx-low-vision';
  closeResult: string;

  departments: any[];
  Tags: string[] = [];
  documents: Observable<any[]> | any;

  users: Observable<any[]>;
  
  Planifications: FormationPlan[]=[];
 
  nameFormation: string;
  id: number;
  test: boolean;
  failed: boolean;
  errorMessage: string;
  SelectedParticipant: User[];
  SelectedDocs:Document[];
  SelectedviewLot:Lot;
  nameLot: string;
  originalPlanifications: any;
  filterValue: string;
  plan:FormationPlan;
  constructor(private gestionLotService : gestionLotService ,private gestionPlanService: gestionPlanService,private route: ActivatedRoute,private userServiceGestService: UserServiceGestService,private modalService: NgbModal,private router: Router,private gestionDocService: GestionDocService) { }

 ngOnInit()
  { 
    
    this.reloadData();
    this.id = this.route.snapshot.params['id'];
    this.gestionLotService.getLotById(this.id).subscribe((data: Lot) => {
    this.SelectedviewLot = data;
    this.SelectedviewLot.formationsPlan.forEach(() => {
    this.setLocalisations() });
    this.nameLot=this.SelectedviewLot.name;
    this.originalPlanifications=this.Planifications;

   
  });
    
   

  }
  setLocalisations() {
    this.SelectedviewLot.formationsPlan.forEach(plan => {
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

reloadData() {
  this.Planifications = [];
  this.documents = this.gestionDocService.getDocList();
  this.documents.subscribe(docs => {
    for (const doc of docs) {
      doc.showIcon = false;
      this.gestionDocService.getDepartementsByDocId(doc.id).subscribe(departments => {
        doc.departments = departments;
      });
    }
  });


  this.userServiceGestService.getUserList().pipe(
    map(users => {
      const filteredUsers = users.filter(user => user.statut == 1);
    
      return filteredUsers.map(user => {
        user.p = '../../assets/images/photoParDefaut.jpg';
        if (user.photo) {
          const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
         
          user.p = API + 'api/gestion/PDP/' + fileName;
        }
        return user;
      });
    })
  ).subscribe(enabledUsers => {
    const disabledPlanifs = this.Planifications.filter(planif => !planif.disabled);
    const enabledPlanifs = this.Planifications.filter(planif => planif.disabled === false)
      .sort((a, b) => {
        // parse start and end dates into Date objects
        const startDateA = new Date(a.startDate).getTime();
        const startDateB = new Date(b.startDate).getTime();
        // sort enabled planifs by start date
        return startDateA - startDateB;
      });
    this.Planifications = enabledPlanifs.concat(disabledPlanifs);
  });
}  


  /* CETTE FONCTION C EST POUR check ICON*/
  toggleIcon(doc) {
    doc.showIcon = !doc.showIcon;
  }
  toggleIcon2(user) {
    user.showIcon = !user.showIcon;
  }

  /* CETTE FONCTION C EST POUR VIEW icon*/
  toggleIcon1() {
    if (this.currentIconClass =='bx bx-low-vision') {
      this.currentIconClass  = 'bx bx-show-alt';
    } else {
      this.currentIconClass = 'bx bx-low-vision';
    }
  }
  
  /*POUR SWITCH EN FONCTION DE USER OU BIEN EN FONCTION DE FORMATION*/
  showusers(){
  this.showuser=true;
  this.showformation=false;
  }

  showformations(){
    this.showuser=false;
    this.showformation=true;
  }


  openlistDoc(openlistdoc,documents)
  {this.SelectedDocs=documents;
    this.modalService.open(openlistdoc, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 
      }  
    }, (reason) =>{  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

  }
  openListPart(openlistparticipant,participants ){
    this.SelectedParticipant=participants;
    this.SelectedParticipant.forEach(participant => {
      participant.photo = '../../assets/images/photoParDefaut.jpg';
      if (participant.photo) {
        const fileName = participant.photo.substring(participant.photo.lastIndexOf('/') + 1);
        participant.photo = API + 'api/gestion/PDP/' + fileName;
      }
    });
    this.modalService.open(openlistparticipant, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 
      }  
    }, (reason) =>{  
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
 

  dateDebutSortDirection: 'asc' | 'desc' = 'asc';
  sortTableByDateDebut() {
    if (this.dateDebutSortDirection === 'asc') {
     // this.tableFormation.sort((a, b) => new Date(a.datedebut).getTime() - new Date(b.datedebut).getTime());
      this.dateDebutSortDirection = 'desc';
    } else {
     // this.tableFormation.sort((a, b) => new Date(b.datedebut).getTime() - new Date(a.datedebut).getTime());
      this.dateDebutSortDirection = 'asc';
    }
  }
  
  
  
  isDateExpired(endDateString: string): boolean {
      const endDate = new Date(endDateString);
      this.test=endDate < new Date();
      return endDate < new Date();
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

    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
      // Filter the Planifications array based on the filter value
      this.Planifications = this.originalPlanifications.filter(plan =>
        plan.formateur.username.toLowerCase().includes(filterValue) ||
        plan.departements.some(dep => dep.name.toLowerCase().includes(filterValue)) ||
        plan.formation.toLowerCase().includes(filterValue) ||
        plan.startDate.toString().includes(filterValue)
      );
    }

}