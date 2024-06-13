
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
const API = `${environment.apiBaseUrl }`;

@Component({
  selector: 'app-detail-form',
  templateUrl: './detail-form.component.html',
  styleUrls: ['./detail-form.component.scss']
})
export class DetailFormComponent implements OnInit {
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
  valid: boolean;
  message: string;
  filterValue: string;
  originalPlanifications: any;
  constructor(private gestionPlanService: gestionPlanService,private route: ActivatedRoute,private userServiceGestService: UserServiceGestService,private modalService: NgbModal,private router: Router,private gestionDocService: GestionDocService) { }

 ngOnInit()
  { 
    
    this.reloadData();
    this.id = this.route.snapshot.params['id'];
    this.gestionPlanService.getListPlanningById(this.id).subscribe((data: FormationPlan[]) => {
    this.Planifications = data;
    this.setLocalisations();
    this.nameFormation=this.Planifications[0].formation.name;
    this.originalPlanifications=this.Planifications;

   
  });
  }
  setLocalisations() {
    this.Planifications.forEach(plan => {
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

        const startDateA = new Date(a.startDate).getTime();
        const startDateB = new Date(b.startDate).getTime();
    
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

   
  opensupform(content, element) {    this.test=this.isDateExpired(element.endDate);

    if(this.test==true)
    {  this.failed=true;
      this.errorMessage='Formation expirée : impossible de faire la suppression';
      setTimeout(() => {
        this.failed = false;
      }, 2500);
    }else{
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
    (result) => {
      this.closeResult = `Closed with: ${result}`;

      if (result === 'yes') {
    
        this.gestionPlanService.deletePlan(element.id).subscribe(
          data => {
           this.valid=true;
           this.message='Formation supprimer avec succès';
           
           setTimeout(() => {
             this.valid = false;
           }, 2500);
          },
          error => console.log(error)
        );
      }
    },
    (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    }
  );
}
  }



  openeditform(element){
    this.test=this.isDateExpired(element.endDate);

    if(this.test==true)
    {  this.failed=true;
      this.errorMessage='Formation expirée : impossible de faire la modification';
      setTimeout(() => {
        this.failed = false;
      }, 2500);
    }
    else{
      this.router.navigate(['/edit-formation',element.id]) ;
    }
  
  }

  openadddoc(adddoc)
  {
    this.modalService.open(adddoc, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 
     
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

  }

  openadduser(adduser)
  {
    this.modalService.open(adduser, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 

      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

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
      participant.p = '../../assets/images/photoParDefaut.jpg';
      if (participant.photo) {
        const fileName = participant.photo.substring(participant.photo.lastIndexOf('/') + 1);
        participant.p = API + 'api/gestion/PDP/' + fileName;
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
  
  navigatetonouvelleform(){
    this.router.navigate(['/creer-formation']);
  }
  navigatetoplanform(){
    this.router.navigate(['/plan-formation']);

  }
  navigatetoplanlot(){
    this.router.navigate(['/plan-lot']);

  }

  
  isDateExpired(endDateString: string): boolean {
      const endDate = new Date(endDateString);
      this.test=endDate < new Date();
      return endDate < new Date();
    }
  
    applyFilter(event: Event) {
      const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    
      // Filter the Planifications array based on the filter value
      this.Planifications = this.originalPlanifications.filter(plan =>
        plan.formateur.username.toLowerCase().includes(filterValue) ||
        plan.departements.some(dep => dep.name.toLowerCase().includes(filterValue)) ||
        plan.année.toString().includes(filterValue)
      );
    }

    download(id:number,titre : string) {
      this.gestionDocService.downloadDocc(id)
        .subscribe(
          data => {
          let fileName=titre;
            let blob:Blob=data.body as Blob;
            let a = document.createElement('a');
            a.download=fileName;
            a.href=window.URL.createObjectURL(blob);
            a.click();
          },
          error => console.log(error));
    }
}