import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { Observable, forkJoin, map } from 'rxjs';
import { Department } from 'src/app/department/departement';
import { GestionDocService } from 'src/app/GestionDoc/gestion-doc.service';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { User } from 'src/app/GestionUser/user';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;
import { gestionPlanService } from '../gestion-plan.service';
import { gestionFormService } from '../gestion-form.service';
import { Formation } from '../formation';
import { FormationPlan } from '../FormationPlan';
import { Lot } from '../lot';
import { gestionLotService } from '../gestion-lot.service';
import { Document } from 'src/app/GestionDoc/document';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { DepartmentService } from 'src/app/department/DepartmentService';


@Component({
  selector: 'app-formations',
  templateUrl: './formations.component.html',
  styleUrls: ['./formations.component.scss']
})

export class FormationsComponent implements OnInit {
  @ViewChild('content') templateRef: TemplateRef<any>;
  showuser:boolean=false;
  showformationP:boolean=false;
  showformationC:boolean=true;
  currentIconClass='bx bx-low-vision';
  closeResult: string;
  showLotsP:boolean=false;
  departments: any[];
  Tags: string[] = [];
  documents: Observable<any[]> | any;

  users: Observable<any[]>;
 
  tableFormationC: Formation[];
  tableFormationP: FormationPlan[];
  tableLot:Lot[];
  tableusers:User[];
  Selectedviewelement:FormationPlan;
  SelectedviewLot:Lot;
  SelctedUser: User;
  SelctedUserPlanning:FormationPlan[];
  intervalsOfSelectedviewelement: Date[][] = [];
  SelctedPlanningToUpdate:FormationPlan;
  id : number;
  SelectedDocs:Document[]
  form: { rech: any; filtre: any; } = { rech: null, filtre: null };

  ////////formation cree //////
  SelectedFormation:Formation;
  newName:String;
  newTrainer:string;
  role: String;
  showAdminBoard: boolean;
  showuserboard: boolean;
  showFormateurboard: boolean;
  isLoggedIn: boolean;
  user: User;
  currentUser: any;
  messagevalid: string;
  valid: boolean=false;
  failed=false;
  errorMessage: string;
  selectedTrainer: string;
  searchText: string='';
  filtertrainers: any[];
  selectedIDtrainer:string;
  selectedIndex: number = -1;
  Deps: string[] = [];
  selectedDocs: any[] = [];
  showselectedfile: Document[] = [];
  formSearch={
    filtre:'nom-doc',
    rech:'',
  }

  constructor(private token: TokenStorageService,private userServiceGestService: UserServiceGestService,private modalService: NgbModal,private router: Router,private gestionDocService: GestionDocService
    ,private gestionPlanService : gestionPlanService, private departementService:DepartmentService,private gestionFormservice : gestionFormService,private gestionLotService : gestionLotService) { }

  ngOnInit(): void 
  {  this.documents =  this.gestionDocService.getDocList();
    this.departementService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    }); 
     this.getList();
   

    if (this.token.getToken()) {
      this.isLoggedIn = true;
      }
    this.currentUser = this.token.getUser();
    this.reloadData();
   
   this.user = new User();
    this.id=this.token.getId()
   this.userServiceGestService.getUser(this.id)
      .subscribe(data => {
      
        this.user = data;
        for(let i=0;i<this.user.roles.length;i++){
          this.role=this.user.roles[i].name;
        }
        if (this.role=="ROLE_ADMIN"){
          this.showAdminBoard=true;
     
        }
        else this.showAdminBoard=false;
 

    if (this.role=="ROLE_USER"){
      this.showuserboard=true;
    }
    else this.showuserboard=false;
    if (this.role=="ROLE_FORMATEUR" ||this.role=="ROLE_ADMIN")

 {

 this.showFormateurboard=true;

  }
});
  }
  async reloadData(): Promise<void> {
    this.documents = await this.gestionDocService.getDocList().toPromise();
    for (const doc of this.documents) {
      doc.showIcon = false;
      await this.gestionDocService.getDepartementsByDocId(doc.id).toPromise().then((departments: Department[]) => {
        doc.departments = departments;
      });
    }
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
        }).sort((a, b) => a.firstname.localeCompare(b.firstname)); 
      })
    );
    this.getList();
  }
  
  reloadDataa(): void {

    this.getList();
    
    }


async getList(): Promise<void> {
  try {
    const formationList = await this.gestionFormservice.getListForm().toPromise();
    this.tableFormationC = formationList;

    const LotList = await this.gestionLotService.getListLot().toPromise();
    this.tableLot = LotList;

    const unassignedPlansList = await this.gestionPlanService.getPlanningNotExpedited().toPromise();
    this.tableFormationP =unassignedPlansList;


    const userList = await this.userServiceGestService.getUserList().toPromise();
    this.tableusers = userList;
    for (const user of this.tableusers) {
      const formationPList = await this.gestionPlanService.getPlanningListS(user.id).toPromise();
    
      const formationPMappee = formationPList.map(fp => fp.startDate).sort();
      const dateFinLaPlusProche = formationPMappee.find(df => new Date(df) > new Date());
      const formationPFiltree = formationPList.filter(fp => fp.startDate === dateFinLaPlusProche);
      user.formations = formationPFiltree;

      user.p = '../../assets/images/photoParDefaut.jpg';
      if (user.photo) {
        const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
        
        user.p = API + 'api/gestion/PDP/' + fileName;
      }   
         
        
    }
  } catch (error) {
    console.error(error);
  }
 
  const LotList = await this.gestionLotService.getListLot().toPromise();
  this.tableLot = LotList;

}

  /* CETTE FONCTION C EST POUR check ICON*/
  toggleIcon(doc) {
    doc.showIcon = !doc.showIcon;
    if (doc.showIcon && !this.selectedDocs.some(d => d.id === doc.id)) {
      this.selectedDocs.push(doc);
     console.log("ajouter");
    
    } else if (!doc.showIcon && this.selectedDocs.some(d => d.id === doc.id)) {
      this.selectedDocs = this.selectedDocs.filter(d => d.id !== doc.id);
      console.log("supprimer");
    }
  }
  toggleIcon2(user) {
    user.showIcon = !user.showIcon;
  }


  showusers(){
  this.showuser=true;
  this.showformationP=false;
  this.showformationC=false;
  this.showLotsP=false;

  }

  showformationsP(){
    this.showuser=false;
    this.showformationP=true;
    this.showformationC=false;
    this.showLotsP=false;

    
  }

  showformationsC(){
    this.showuser=false;
    this.showformationP=false;
    this.showformationC=true;
    this.showLotsP=false;

  }

  showLotP(){
    this.showuser=false;
    this.showformationP=false;
    this.showformationC=false;
    this.showLotsP=true;
    
  }
 
   
   opensupform(content,id : number) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;
       if (result === 'yes') { 
      this.gestionPlanService.deletePlan(id).subscribe(
          data => {
           
            this.valid = true;
            this.messagevalid = ("Formation supprimer avec succés");
            this.getList();
            setTimeout(() => {
              this.valid = false;
            }, 2000);
       
           },
       
           error => (error) => {
             
             this.failed = true;
             this.errorMessage = ("Echec" );
             setTimeout(() => {
             this.failed = false;
               }, 1500);
             })
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  
  } 
  opensupLot(contentLot,id : number) {  
  this.modalService.open(contentLot, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
    this.closeResult = `Closed with: ${result}`;
     if (result === 'yes') { 
    this.gestionLotService.deleteLot(id).subscribe(
        data => {
          this.valid = true;
          this.messagevalid = ("Lot supprimer avec succés");
          this.getList();
          setTimeout(() => {
            this.valid = false;
          }, 2000);
     
         },
     
         error => (error) => {
       
           this.failed = true;
           this.errorMessage = ("Echec" );
           setTimeout(() => {
           this.failed = false;
             }, 1500);
           })}
  }, (reason) => {  
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
  });  
} 

  opensupuser(contente,idUser) { 
    this.modalService.open(contente, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 

       this.gestionPlanService.deleteParticipationFromAllPlanning(idUser).subscribe(
          data => {
            this.getList();
            this.valid = true;
          this.messagevalid = ("La participation de l'utilisateur a été retirée de toutes les planifications.");
            setTimeout(() => {
            this.valid = false;
          }, 3000);
     
            this.reloadData();
          },
          error => (error) => {
           
            this.getList();
            this.failed = true;
            this.errorMessage = ("Echec" );
            setTimeout(() => {
            this.failed = false;
              }, 1500);
            })}
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  
  } 
  openuserdetails(contentdetails, id) {
    forkJoin([
      this.gestionPlanService.getPlanningListS(id),
      this.userServiceGestService.getUser(id)
    ]).subscribe(([plannings, user]) => {
      this.SelctedUserPlanning = plannings;
      this.SelctedUser = user;
      this.modalService.open(contentdetails, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => { 
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {  
        this.currentIconClass = 'bx bx-low-vision';
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
      }); 
    }, error => console.log(error));
  }
  
  modalRef: NgbModalRef;

  opensupuformdeuser(contentsupformdeuser, contentModificationuser, idFormation, idUser) {
    this.modalRef = this.modalService.open(contentsupformdeuser, { ariaLabelledBy: 'modal-basic-title' });
    
    this.modalRef.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.gestionPlanService.deleteParticipationFromPlanning(idFormation, idUser).subscribe(
          data => {
            this.getList();
            this.reloadData();
            this.modalRef.dismiss(); 
            this.openusermodification(contentModificationuser, idUser);
          },
          error => console.log(error)
        );
       
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  openusermodification(contentModificationuser, id) {
    forkJoin([
      this.gestionPlanService.getPlanningListS(id),
      this.userServiceGestService.getUser(id)
    ]).subscribe(([plannings, user]) => {
      this.SelctedUserPlanning = plannings;
      this.SelctedUser = user;
      this.modalService.open(contentModificationuser, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
        this.closeResult = `Closed with: ${result}`;  
        if (result === 'yes') { 
         
        }  
      }, (reason) => {  
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
      });
    }, error => console.log(error));
  }
  
  
  opendetailsform(contentdetailform,element:Formation){
    this.SelectedFormation=element;
    this.Selectedviewelement.participants.forEach(participant => {
      participant.p = '../../assets/images/photoParDefaut.jpg';
      if (participant.photo) {
        const fileName = participant.photo.substring(participant.photo.lastIndexOf('/') + 1);
        participant.p = API + 'api/gestion/PDP/' + fileName;
      }
    });
    
    this.modalService.open(contentdetailform, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {  
       
      }  
    }, (reason) => {  
      this.currentIconClass = 'bx bx-low-vision';
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

  }
  updateFormation(id,name) {  
    this.gestionFormservice.updateForm(id, name).subscribe(
      (response) => {

        this.modalService.dismissAll();
      },
      (error) => {

       
      }
    );
  }
  
  opendetailslot(contentdetaillot,element){
    this.modalService.open(contentdetaillot, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {  
      this.currentIconClass = 'bx bx-low-vision';
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

  }
  openeditform(id){
    this.router.navigate(['/edit-formation',id]) ;
 
  }   
  openeditlot(id){
    this.router.navigate(['/edit-lot',id]) ;
  }
  opendetaillot(id){
    this.router.navigate(['/detail-lot',id]) ;
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
  { this.SelectedDocs=documents;
    this.modalService.open(openlistdoc, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
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
  
  sortDirection: 'asc' | 'desc' = 'asc';

  sortTable() {
    if (this.sortDirection === 'asc') {

      this.sortDirection = 'desc';
    } else {

      this.sortDirection = 'asc';
    }
  }
  dateDebutSortDirection: 'asc' | 'desc' = 'asc';
  sortTableByDateDebut() {
    if (this.dateDebutSortDirection === 'asc') {
      this.tableFormationP.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      this.dateDebutSortDirection = 'desc';
    } else {
      this.tableFormationP.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      this.dateDebutSortDirection = 'asc';
    }
  }
  showdetailform(id) {
    this.router.navigate(['/detail-form', id]);
  }

  openType(element,contentdetailform)
  { 

    this.Selectedviewelement=element;

      this.opendetailsform(contentdetailform,element)
     this.setLocalisations();
     this.gestionPlanService.getIntervalle(this.Selectedviewelement.id).subscribe((intervalsSet) => {
      this.intervalsOfSelectedviewelement = Array.from(intervalsSet).sort((a, b) => a[0].getTime() - b[0].getTime());
    });

  }

  setLocalisations() {
   
      if (this.Selectedviewelement.enLigne && this.Selectedviewelement.salle) {
        this.Selectedviewelement.localisation = 'En Ligne - Presentielle : ' + this.Selectedviewelement.salle;
      } else if (this.Selectedviewelement.enLigne) {
        this.Selectedviewelement.localisation = 'En Ligne';
      } else if (this.Selectedviewelement.salle) {
        this.Selectedviewelement.localisation = 'Presentielle : ' + this.Selectedviewelement.salle;
      } else {
        this.Selectedviewelement.localisation = 'NON INDIQUEE';
      }
    }
    
     searchFormationByName(name: string): void {
      const { rech, filtre } = this.form;

      if (filtre === 'vide' || filtre === null || !name || name.trim() === '') {

        this.reloadData();
        return;
      }
    
      this.gestionFormservice.getFormationByName(name).subscribe(
        (formation) => {
          this.tableFormationC = this.tableFormationC.filter((f) => f.name.toLowerCase().includes(name.toLowerCase()));
 
        },
        (error) => {
         
        }
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
      opensupformc(content,id : number) { 

       this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => { 
      
        this.closeResult = `Closed with: ${result}`;
      
        if (result === 'yes') {
      
        this.gestionFormservice.deleteForm(id).subscribe(
      
          data => {
      

           this.valid = true;
           this.messagevalid = ("Formation supprimer avec succés");
           this.getList();
           setTimeout(() => {
             this.valid = false;
           }, 2000);
      
          },
      
          error => (error) => {

            this.failed = true;
            this.errorMessage = ("Echec" );
            setTimeout(() => {
            this.failed = false;
              }, 1500);
            })
      
          }
      
       }, (reason) => { 
      
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      
       }); 
      
      }

      openListPartLot(contentListParticipants, lotId: number) {
        this.SelectedviewLot = this.tableLot.find(lot => lot.id === lotId);
        

        this.SelectedviewLot.participants.forEach(participant => {
          participant.p = '../../assets/images/photoParDefaut.jpg';
          if (participant.photo) {
            const fileName = participant.photo.substring(participant.photo.lastIndexOf('/') + 1);
            participant.p = API + 'api/gestion/PDP/' + fileName;
          }
        });
      
        this.modalService.open(contentListParticipants, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
          this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
      }
      

      openeditformcree(contenteditformcree,element:Formation){
           this.selectedDocs=element.documents;
           this.showselectedfile=element.documents;

           this.departments.forEach(department => department.selected = false);
           this.Deps=[];
           this.Deps.push(...element.departments.map(department => department.name));

           element.departments.forEach((department) => {
             const index = this.departments.findIndex((dep) => dep.name === department.name);
             if (index > -1) {
               this.departments[index].selected = true;
             }
           });

        this.SelectedFormation=element;
        this.newName=element.name;
        this.selectedTrainer = this.SelectedFormation.formateur.username;
 
    this.modalService.open(contenteditformcree, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {  
        
        this.SelectedFormation.id; 
       
       

     const formData = new FormData();
     if (true){


      for (var j = 0; j < this.selectedDocs.length; j++){
        formData.append("documents", this.selectedDocs[j].id);
        
      }
    }
   
    if (this.Deps.length > 0) {
      for (var j = 0; j < this.Deps.length; j++) {
        formData.append("departements", this.Deps[j]);
      }
    }

formData.append('name', this.newName.toString());
formData.append('formateur', this.selectedTrainer);


    this.gestionFormservice.updateForm(this.SelectedFormation.id,formData).subscribe();
    this.showselectedfile=[]
    this.reloadData()}  
    }, (reason) => {  
      this.currentIconClass = 'bx bx-low-vision';
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  
      }
        /*fonction pour choisir le formateur*/
filterTrainers() {
  this.users.subscribe(users => {
    this.filtertrainers = users.filter(user => user.username.toLowerCase().includes(this.searchText.toLowerCase()));
  });
}
/*select trainer*/
selectTrainer(user) {
  this.selectedTrainer =user.username;
  this.selectedIDtrainer=user.id;
  this.reloadData();
}

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
Search() {
  
  if (this.formSearch.filtre === "nom-doc") {
     
   this.documents = this.gestionDocService.getDocByTit(this.formSearch.rech.toLowerCase());
     
     }

   if (this.formSearch.filtre === "poste") {
     
    this.documents = this.gestionDocService.getDocByDep(this.formSearch.rech.toUpperCase());
     
   }
     
   if (this.formSearch.filtre === "tag") {
     
    this.documents = this.gestionDocService.getDocByTag(this.formSearch.rech.toLowerCase());
     
   }
     
   if (this.formSearch.filtre === "vide" || this.formSearch.filtre === null || this.formSearch.rech === null || this.formSearch.rech === '' || this.formSearch.rech === undefined) {
     
   this.reloadData();
     
   }
     
  }
  openadddoc(adddoc)
  {
    this.modalService.open(adddoc, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {   
        this.ShowSelectedFile();
      }

    }, (reason) => { 
     this.selectedDocs=[];
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }  



delet(doc)
{
this.showselectedfile = this.showselectedfile.filter(d => d.id !== doc.id);

}

ShowSelectedFile(){
  this.showselectedfile=this.selectedDocs;
}
      
    }
