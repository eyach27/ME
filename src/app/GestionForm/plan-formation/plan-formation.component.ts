import { Component, HostBinding, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, filter, map } from 'rxjs';
import { GestionDocService } from 'src/app/GestionDoc/gestion-doc.service';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { DepartmentService } from 'src/app/department/DepartmentService';
import { Department } from 'src/app/department/departement';
import { ThemeService } from 'src/app/theme.service';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;
import { DatePipe, Time } from '@angular/common';
import { HighContrastMode } from '@angular/cdk/a11y';
import { User } from 'src/app/GestionUser/user';
import { gestionPlanService } from '../gestion-plan.service';
import{gestionFormService}from '../gestion-form.service'
import { FormBuilder, NgModel } from '@angular/forms';
import { Formation } from '../formation';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-plan-formation',
  templateUrl: './plan-formation.component.html',
  styleUrls: ['./plan-formation.component.scss'],
  
})
export class PlanFormationComponent implements OnInit {

  selectedIndex: number = -1;
  isLoggedIn = false;
  @HostBinding('class') componentClass = 'light';
  currentIconClass='bx bx-check-square';
  closeResult: string;
  Deps: string[] = [];

  departments: any[];
  Tags: string[] = [];
  documents: Observable<any[]> | any;
  users: Observable<any[]>;
  selectedDocs: any[] = [];
  showselectedfile: any[] = [];
  selecteduser: any[] = [];
  showselecteduser: any[] = [];

  dateDebut:Date;
  datedFormatee:String;
  heured:String ='09:00';
  heuredaff:String;

  datefin:Date;
  datefFormatee:String;
  heuref:String ='18:00';
  heurefaff:String;s

  nbrep:String='1';
  nbrepaff:String;
 
  typerep:String='jour';
  typerepaff:String

  minDateFin: string;

  selectedDays: string[] = [];
  selectedDaysfrench: string[] = [];
  classtime: string ='bx bx-time-five';
  searchTextTrainer: string='';
  searchText: string='';
  filtertrainers: any[];
  selectedTrainer: string;
  form:any={name:null,type:null};
  filteredUsers: any;
  formationName = new FormControl();
  msg:string='';


 ///////////dispo///////////
 idFormateur: number;
 typePlan: String;
 jourSemaine: string[];
 heure_date_Debut: Date;
 heure_date_Fin: Date;
 repeterChaque: number
 selectedUserId: number;
 messageDispo: string = '';
 message: string = '';
isSuccess: boolean = false;
isError: boolean = false;


///////////////formation////////////
formations: Formation[];
FormationName:String
//////////////en ligne & presentiel///////////
salle: string = '';
enPresentiel: boolean = false;
enLigne: boolean = false;
lieuVisible: boolean = false;
lieu: string = null;
////////////////////////////
description: string = '';
  updateListUsers: Observable<any[]>;
  messagevalid: string;
  valid: boolean=false;
  failed=false;
  errorMessage: string;
  msgRep: string;
  testrep:boolean=true;
  disabled:boolean=true;

  formateurExiste: boolean = false;
  tempDefni: boolean = false;
  salleInput: any;
  isSalleTouched: boolean = false;
  formSearch={
    filtre:'nom-doc',
    rech:'',
  }

  constructor(private gestionDocService: GestionDocService,private themeService: ThemeService,private gestionPlanService : gestionPlanService,private gestionFormService : gestionFormService,
 private userServiceGestService: UserServiceGestService, private departementService:DepartmentService, private tokenStorageService : TokenStorageService,private router: Router,private modalService: NgbModal,private datePipe: DatePipe) { 
    this.themeService.observeMode().subscribe(mode => { 
      this.componentClass = mode;
    });
    
    
  }

  ngOnInit(): void {
    this.departementService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    }); 
    
    if (this.tokenStorageService.getToken()) 
    {
      this.isLoggedIn = true;
    }
    this.reloadData();

    this.gestionFormService.getListForm().subscribe(formations => {

      this.formations = formations;
      
     });
  
  }


  reloadData() {
    this.documents = this.gestionDocService.getDocList();
    this.documents.subscribe((docs) => {
   
      for (const doc of docs) {
        doc.showIcon = false;
        this.gestionDocService.getDepartementsByDocId(doc.id).subscribe((departments: Department[]) => {
          doc.departments = departments;
        });
      }
    });
    
    this.users = this.userServiceGestService.getUserList().pipe(
      map(users => {
        
        const filteredUsers = users.filter(user => user.statut == 1 && user.username !==this.selectedTrainer);
        return filteredUsers.map(user => {
          user.p = '../../assets/images/photoParDefaut.jpg';
          if (user.photo) {
            const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
            //console.log(fileName); // Output: "nom.png"
            user.p = API + 'api/gestion/PDP/' + fileName;
          }
          return user;
        }).sort((a, b) => a.firstname.localeCompare(b.firstname)); // trier par ordre alphabétique du nom
      })
    );
  
  }

  onDepartmentSelected(selectElement: EventTarget) {
    const select = selectElement as HTMLSelectElement;
    const selectedValue = select.value;
    //this.Deps.push(selectedValue);
    this.selectedIndex = select.selectedIndex;
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

  openadduser(adduser)
  {
    this.modalService.open(adduser, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 
        this.ShowSelecteduser();
      }  
    }, (reason) => { 
      this.selecteduser=[];
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

  }



  opentemps(temps)
  {
    this.modalService.open(temps, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') { 
        this.classtime ='bx bxs-time';
     this.onSave();

      }  
    }, (reason) => { 
      this.viderTemps()
    
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    });  

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
  
  private getDismissReason(reason: any): string { 
 
    if (reason === ModalDismissReasons.ESC) { 
      return 'by pressing ESC';  
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {  
      return 'by clicking on a backdrop';  
    } else {    
      return `with: ${reason}`;  
    }  
  }


  /////ADD DOC//
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


  delet(doc)
  {
  this.showselectedfile = this.showselectedfile.filter(d => d.id !== doc.id);
 
  }

  ShowSelectedFile(){
    this.showselectedfile=this.selectedDocs;
  }
////////////////////


/////ADD user////
  toggleIcon2(user) {
    user.showIcon = !user.showIcon;
    if (user.showIcon && !this.selecteduser.some(u => u.id === user.id)) {
      this.selecteduser.push(user);
      console.log("ajouter");
  
    } else if (!user.showIcon && this.selecteduser.some(u => u.id === user.id)) {
      this.selecteduser = this.selecteduser.filter(u => u.id !== user.id);
      console.log("supprimer");
    }
  }

  ShowSelecteduser(){
    this.showselecteduser=this.selecteduser;
  }
  deletuser(user)
  {
  this.showselecteduser = this.showselecteduser.filter(u => u.id !== user.id);
  
  }

onPresentielChange(event) {
  this.lieuVisible = event.target.checked;
  if (!this.lieuVisible) {
    this.lieu = null;
  }
}

  /*transformer le temps */
  transformertemps()
  { 
    if(this.dateDebut!=null)
    {
      this.datedFormatee = "le " +this.datePipe.transform(this.dateDebut, 'dd/MM/yyyy');
      
    }
    else{
      this.datedFormatee="le ...";
    }
    

    if(this.datefin!=null)
    {
      this.datefFormatee = "jusqu'a le "+this.datePipe.transform(this.datefin, 'dd/MM/yyyy');
      this.disabled=false;
    }
    else{
      this.datefFormatee="jusqu'a le..."
      
    }

    if(this.heured !=null)
    {
      this.heuredaff=" à "+this.heured;
    }
    else{
      this.heuredaff=" à ...";
    }

    if(this.heuref!=null)
    {
      this.heurefaff=" à "+this.heuref;
    }
    else{
      this.heurefaff=" à ...";
    }


    if(this.nbrep!=null)
    {
      if(this.nbrep=="1")
      {
        this.nbrepaff=" et se répéte chaque";
      }
      else{
        this.nbrepaff=" et se répéte tous les " + this.nbrep;
      }
    }
    else{
      this.nbrepaff=" et se répéte tous les ... ";
    }
  
    if(this.typerep!=null)
    {
      if(this.nbrep!="1")
      {
         this.typerepaff=this.typerep+"s";
      }
      else{
        this.typerepaff=this.typerep;
      }
    }

    if(this.dateDebut==this.datefin)
    { this.nbrep='1';
    this.typerep='jour';
      this.typerepaff='';
      this.nbrepaff='';
      this.heuredaff=' de '+this.heured;
      this.heurefaff=' à '+this.heuref;
      this.datefFormatee='';
      
    }
  }

  TestRep()
  {
    let dateDebutt = new Date(this.dateDebut);
    let dateFinn = new Date(this.datefin);
    let diffMs = dateFinn.getTime() - dateDebutt.getTime();
    let jours = diffMs / (1000 * 60 * 60 * 24);

    if(this.typerep=='semaine')
   {
    
      let monNombre = Number(this.nbrep)*7;
      if(jours>=monNombre)
      {
        this.testrep=true;
       
      }
      else{
        
        this.msgRep="Votre choix de nombre ou bien type de répétition est incorrecte";
        this.testrep=false;
     
      }

 
   }
   if(this.typerep=='jour')
   {
 
   
      if(jours % Number(this.nbrep) ==0)
      {
        this.testrep=true;

      }
      else{
        
        this.msgRep="Votre choix de nombre ou bien type de répétition est incorrecte";
        this.testrep=false;
    
      }

 
   }

}

  onDateDebutChange(){
   
   const dateDebut = new Date(this.dateDebut);
  
   
   const jourDebut = dateDebut.getDate();
   const moisDebut = dateDebut.getMonth() + 1;
   const anneeDebut = dateDebut.getFullYear();
   this.minDateFin = `${anneeDebut}-${moisDebut.toString().padStart(2, '0')}-${jourDebut.toString().padStart(2, '0')}`;
  }



 /*selected day de la semaine */
 onSelectDay(day: string) {

    const index = this.selectedDays.indexOf(day);
  if (index === -1) {
    this.selectedDays.push(day);
    switch (day) {
      case 'MONDAY':
        this.selectedDaysfrench.push('Lundi');
        break;
      case 'TUESDAY':
        this.selectedDaysfrench.push('Mardi');
        break;
      case 'WEDNESDAY':
        this.selectedDaysfrench.push('Mercredi');
        break;
      case 'THURSDAY':
        this.selectedDaysfrench.push('Jeudi');
        break;
      case 'FRIDAY':
        this.selectedDaysfrench.push('Vendredi');
        break;
      case 'SATURDAY':
        this.selectedDaysfrench.push('Samedi');
        break;
      case 'SUNDAY':
        this.selectedDaysfrench.push('Dimanche');;
        break;
    }
   
  } else {
    this.selectedDays.splice(index, 1);
    this.selectedDaysfrench.splice(index, 1);

  } 
    
}



onChangeRepeatType() {
  this.selectedDays = [];
  this.selectedDaysfrench= [];
  this.testrep=true;
  this.TestRep();
}


filterTrainers() {
  this.users.subscribe(users => {
    this.filtertrainers = users.filter(user => user.username.toLowerCase().includes(this.searchTextTrainer.toLowerCase()));
    console.log(this.filtertrainers); 
  });
}

showallusers(user){
  this.users = this.userServiceGestService.getUserList().pipe(
    map(users => {
      
      const filteredUsers = users.filter(user => user.statut == 1 && user.username !==this.selectedTrainer);
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
}

selectTrainer(user) {
  this.selectedTrainer =user.username;
  this.selectedUserId=user.id;
  this.onchangeFormateur();
 this.showallusers(user);
 this.formateurExiste = true;
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
      onOptionSelected(event: MatAutocompleteSelectedEvent) {
        this.showselectedfile=[];
        this.Deps=[];
        const selectedFormation = this.formations.find(formation => formation.name === event.option.value);
      
        if (selectedFormation) {
          this.FormationName=selectedFormation.name;
          this.selectedTrainer=selectedFormation.formateur.username;
          this.formateurExiste = true;
        
          this.selectedUserId=selectedFormation.formateur.id;
      
          this.departments.forEach(department => department.selected = false);
      
          this.selectedDocs=[];
          this.selectedDocs.push(...selectedFormation.documents);
          this.Deps=[];
          this.Deps.push(...selectedFormation.departments.map(department => department.name));
      

          selectedFormation.departments.forEach((department) => {
            const index = this.departments.findIndex((dep) => dep.name === department.name);
            if (index > -1) {
              this.departments[index].selected = true;
            }
          });
      
          this.ShowSelectedFile();
        }
      }
      
/*fonction save time*/
onSave() {
  
  if (!this.selectedUserId) {
    this.messageDispo = 'Veuillez choisir un formateur pour vérifier sa disponibilité.';
    return;
  }
  const formData = {
    idFormateur: this.selectedUserId,
    TypePlan:  this.typerep,
    jourSemaine: this.selectedDays, 
    heure_date_Debut: new Date(this.dateDebut + 'T' + this.heured + ':00').toISOString(),
    heure_date_Fin: new Date(this.datefin + 'T' + this.heuref + ':00').toISOString(),
    repeterChaque: this.nbrep
  };
  this.gestionPlanService.checkDispo(formData).subscribe(
    response => {
       
       this.isSuccess = true;
       this.isError = false;
       this.message = 'Le formateur est disponible.';
      
       this.tempDefni=true;
    },
    error => {
      this.isSuccess = false;
      this.isError = true;
      this.message = 'Le formateur n\'est pas disponible.';
      this.tempDefni=false;
     
    }
  );
}
PlanifierFormation() {
  if(this.enPresentiel == true){

  }
  const formDataP = {
    idFormateur: this.selectedUserId,
    TypePlan: this.typerep,
    jourSemaine: this.selectedDays,
    heure_date_Debut: new Date(this.dateDebut + 'T' + this.heured + ':00').toISOString(),
    heure_date_Fin: new Date(this.datefin + 'T' + this.heuref + ':00').toISOString(),
    repeterChaque: this.nbrep,
    nameFormation: this.FormationName,
    description: this.description,
    salle: this.lieu,
    EnLigne: this.enLigne,
    idParticipants: this.selecteduser.map(u => u.id),
    idDocuments: this.selectedDocs.map(doc => doc.id),
    idDepartements: this.Deps
  };
  


  if (formDataP.TypePlan === 'semaine') {
   this.gestionPlanService.planifierFormationParSemaine(formDataP).subscribe(
      (result) => {

            this.valid = true;
            this.messagevalid = ("Formation planifiée avec succés");
            setTimeout(() => {
              this.router.navigate(['/formations']) ;
            }, 2000);
      },
      (error) => {
        this.failed = true;
        this.errorMessage = ("Echec :" + error);
        setTimeout(() => {
        this.failed = false;
          }, 1500);
      }
    );
  } else if (formDataP.TypePlan === 'jour') {
    this.gestionPlanService.planifierFormationParJour(formDataP).subscribe(
      (result) => {
        
        this.valid = true;
        this.messagevalid = ("Formation planifiée avec succés");
        setTimeout(() => {
          this.router.navigate(['/formations']) ;
        }, 2000);
      },
      (error) => {
        
        this.failed = true;
        this.errorMessage = ("Echec :" + error);
        setTimeout(() => {
        this.failed = false;
          }, 1500);
      }
    );
  } else {
   
    this.failed = true;
        this.errorMessage = ("Planification invalide");
        setTimeout(() => {
        this.failed = false;
          }, 1500);
      }
  
} 


viderTemps(){
  this.classtime ='bx bx-time-five';
  this.onChangeRepeatType();
  this.heured='09:00';
  this.heuref='18:00';
  this.nbrep='1';
  this.typerep='Jour'
  this.dateDebut=new Date('jj/mm/aa');
  this.datefin=new Date('jj/mm/aa');
  this.testrep=true;
  this.disabled=false;
}
onchangeFormateur(){
  this.viderTemps();
  this.isError=false;
  this.isSuccess=false;  
}

viderTous()
{
  this.onchangeFormateur();
  this.description='';
  this.lieu='';
  this.enLigne=false;
  this.enPresentiel=false;

}
salleNotValide(){
  return this.enPresentiel && !this.lieu
}
}