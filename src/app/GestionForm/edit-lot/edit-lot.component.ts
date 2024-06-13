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
import { FormControl } from '@angular/forms';
import { DepartmentService } from 'src/app/department/DepartmentService';
const API = `${environment.apiBaseUrl }`;

@Component({
  selector: 'app-edit-lot',
  templateUrl: './edit-lot.component.html',
  styleUrls: ['./edit-lot.component.scss']
})
export class EditLotComponent implements OnInit {
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
  Selectedviewelement:FormationPlan;
  intervalsOfSelectedviewelement: Date[][] = [];
  LotName = new FormControl();
  newNameLot:String;
  showparticipants:boolean=false;
  showposte:boolean=false;
  messagevalid: string;
  valid: boolean=false;
  constructor(private gestionLotService : gestionLotService ,private departementService:DepartmentService,private gestionPlanService: gestionPlanService,private route: ActivatedRoute,private userServiceGestService: UserServiceGestService,private modalService: NgbModal,private router: Router,private gestionDocService: GestionDocService) { }

 ngOnInit()
  { 
    this.departementService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    }); 
    this.id = this.route.snapshot.params['id'];
   this.reloadData();
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
  this.users = this.userServiceGestService.getUserList().pipe(
    map(users => {
      const filteredUsers = users.filter(user => user.statut == 1);
      return filteredUsers.map(user => {
        user.p = '../../assets/images/photoParDefaut.jpg';
        if (user.photo) {
          const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
          user.p = API + 'api/gestion/PDP/' + fileName;
        }
        return user;
      }).sort((a, b) => a.firstname.localeCompare(b.firstname)); // trier par ordre alphabétique du nom
    })
  );
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
  this.gestionLotService.getLotById(this.id).subscribe((data: Lot) => {
    this.SelectedviewLot = data;
    this.selecteduser=this.SelectedviewLot.participants.map(user => {
      user.p = '../../assets/images/photoParDefaut.jpg';
      if (user.photo) {
        const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
   
        user.p = API + 'api/gestion/PDP/' + fileName;
      }
      return user;
    })
      this.showselecteduser=this.SelectedviewLot.participants.map(user => {
        user.p = '../../assets/images/photoParDefaut.jpg';
        if (user.photo) {
          const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
         
          user.p = API + 'api/gestion/PDP/' + fileName;
        }
        return user;
      })
    this.SelectedviewLot.formationsPlan.forEach(() => {
    this.setLocalisations() });
    this.nameLot=this.SelectedviewLot.name;
    this.Deps.push(...this.SelectedviewLot.departments.map(department => department.name));
    this.SelectedviewLot.departments.forEach((department) => {
      const index = this.departments.findIndex((dep) => dep.name === department.name);
      if (index > -1) {
        this.departments[index].selected = true;
      }
    });
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
   // user.showIcon = !user.showIcon;
    user.showIcon = !user.showIcon;
    if (user.showIcon && !this.selecteduser.some(u => u.id === user.id)) {
      this.selecteduser.push(user);
      console.log("ajouter");
  
    } else if (!user.showIcon && this.selecteduser.some(u => u.id === user.id)) {
      this.selecteduser = this.selecteduser.filter(u => u.id !== user.id);
      console.log("supprimer");
    }
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

  
   
   opensupform(content,Plan) { 
  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 
        this.test=this.isDateExpired(Plan.endDate);

        if(this.test==true)
        {  this.failed=true;
          this.errorMessage='Formation expirée : impossible de faire la suppression';
          setTimeout(() => {
            this.failed = false;
          }, 2000);
        }
        else{
        this.gestionLotService.removePlanning(Plan.id,this.id).subscribe(
          data => {
      
             this.reloadData();
            this.valid=true;
            this.messagevalid=('Formation retirée avec success')
            setTimeout(() => {
              this.valid=false;
              
                 }, 2500);
            }, 
          error => {console.log(error);
            this.failed=true;
              this.errorMessage='Erreur: formation non retiré';
              setTimeout(() => {
                this.failed = false;
              }, 2500);
            }
          );

        console.log("formation supprimée avec succès");
      }  }
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  
  } 

  openeditform(element){
    this.test=this.isDateExpired(element.endDate);

    if(this.test==true)
    {  this.failed=true;
      this.errorMessage='Formation expirée : impossible de faire la modification';
      setTimeout(() => {
        this.failed = false;
      }, 2000);
    }
    else{
      this.router.navigate(['/edit-formation',element.id]) ;
    }
  
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

  openaddform(element){
  this.router.navigate(['/add-form-lot',element.id]);
    }
    retour(){
      this.router.navigate(['/formations']);

    }
    formData = new FormData()
    updateLot() {

    const body = {
      
    name: this.nameLot,
      
    IDparticipants: this.selecteduser.map(user => user.id),
      
    departements: this.Deps
      
     };
      
   this.gestionLotService.UpdateLot(body, this.id).subscribe(
    data => {
      
      this.reloadData();
     this.valid=true;
     this.messagevalid=('Lot modifié avec success')
     setTimeout(() => {
       this.valid=false;
       
          }, 2500);
     }, 
   error => {console.log(error);
     this.failed=true;
       this.errorMessage='Erreur: Lot non modifié';
       setTimeout(() => {
         this.failed = false;
       }, 2500);
     }
   );

}

    selectedIndex: number = -1;
    Deps: string[] = []
    onDepartmentSelected(selectElement: EventTarget) {
      const select = selectElement as HTMLSelectElement;
      const selectedValue = select.value;
      //this.Deps.push(selectedValue);
      this.selectedIndex = select.selectedIndex;
    }
    toggleDepartmentSelection(index: number) {
      const department = this.departments[index];
      department.selected = !department.selected;
    
      if (department.selected) {
        this.Deps.push(department.name);
      } else {
        const index = this.Deps.indexOf(department.name);
        if (index > -1) {
          this.Deps.splice(index, 1);
        }
      }
    }


    selecteduser: any[] = [];
    showselecteduser: any[] = [];
    openadduser(adduser)
    {
      this.modalService.open(adduser, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
        this.closeResult = `Closed with: ${result}`;  
        if (result === 'yes') { 
          this.ShowSelecteduser();
        }  
      }, (reason) => { 
       // this.selecteduser=[];
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
      });  
  
    }
    ShowSelecteduser(){
      this.showselecteduser=this.selecteduser;
    }
    deletuser(user)
    {
    this.showselecteduser = this.showselecteduser.filter(u => u.id !== user.id);
    this.selecteduser = this.selecteduser.filter(u => u.id !== user.id);
    console.log("supprimer");
    }

    filteredUsers: any; 
  searchText: string='';
  updateFilteredUsers()
  { 
    
    
    if(this.searchText=='')
    { 
      
     
      this.filteredUsers = this.users.pipe(
        map((users: User[]) => {
          return users as any[];
        })
      );
    
    }


   }
   Showparticipants(){
    if(this.showparticipants==true)
    {
      this.showparticipants=false;
    }
    else{
      this.showparticipants=true;
    }
   
   }

   Showposte(){
    if(this.showposte==true)
    {
      this.showposte=false;
    }
    else{
      this.showposte=true;
    }
   }
  }