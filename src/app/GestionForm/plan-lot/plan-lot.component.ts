import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, map } from 'rxjs';
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
import { FormationPlan } from '../FormationPlan';
import { gestionPlanService } from '../gestion-plan.service';
import { gestionLotService } from '../gestion-lot.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-plan-lot',
  templateUrl: './plan-lot.component.html',
  styleUrls: ['./plan-lot.component.scss']
})
export class PlanLotComponent implements OnInit {
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

  dateDebut: Date;
  datedFormatee:String;
  heured:String ='09:00';
  heuredaff:String;

  datefin:Date;
  datefFormatee:String;
  heuref:String ='18:00';
  heurefaff:String;

  nbrep:String = '1';
  nbrepaff:String;
 
  typerep:String = 'jour';
  typerepaff:String;

  minDateFin: string;

  selectedDays: string[] = [];
  classtime: string ='bx bx-time-five';

  searchText: string='';
  filtertrainers: any[];
  selectedTrainer: string = '';
  selectedItemIndex: number[] = [];


  

  ///////////dispo///////////
  idFormateur: number;
  typePlan: String;
  jourSemaine: string[];
  heure_date_Debut: Date;
  heure_date_Fin: Date;
  repeterChaque: number
  selectedUserId: number;
  messageDispo: string = '';
  disponibilité : boolean=true;
  msg:string='';
  form:any={name:null,type:null};
  filteredUsers: any;



/***********/
  tableFormationP: FormationPlan[];
  formPplan: any[] = [];
  Formateurs: any[] = [];
  filteredPlans: FormationPlan[];

  messagevalid: string;
  valid: boolean=false;
  failed=false;
  errorMessage: string;
  LotName = new FormControl();
  formSearch={
    filtre:'nom-doc',
    rech:'',
  }

 
  
  constructor(private gestionLotService :gestionLotService, private gestionPlanService : gestionPlanService, private gestionDocService: GestionDocService,private themeService: ThemeService,private userServiceGestService: UserServiceGestService, private departementService:DepartmentService, private tokenStorageService : TokenStorageService,private router: Router,private modalService: NgbModal,private datePipe: DatePipe) { 
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

    if(this.disponibilité=true)
    {
      this.msg='formateur disponible'
    }
    else{
      this.msg="formateur non disponible"
    }


    
     this.gestionPlanService.getPlanningNotExpedited().subscribe(
      data => {this.tableFormationP=data
       
    },

      error => { }
      );
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
  }

  onDepartmentSelected(selectElement: EventTarget) {
    const select = selectElement as HTMLSelectElement;
    const selectedValue = select.value;
    //this.Deps.push(selectedValue);
    this.selectedIndex = select.selectedIndex;
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
        //this.onSave();

      }  
    }, (reason) => { 
      this.classtime ='bx bx-time-five';
      this.onChangeRepeatType();
      this.typerep='jour';
      this.nbrep='1';
      this.heured='09:00';
      this.heuref='18:00';
      this.dateDebut=new Date('jj/mm/aa');
      this.datefin=new Date('jj/mm/aa');
   
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



  toggleIcon(doc) {
    doc.showIcon = !doc.showIcon;
    if (doc.showIcon && !this.selectedDocs.some(d => d.id === doc.id)) {
    this.selectedDocs.push(doc);
   

  } else if (!doc.showIcon && this.selectedDocs.some(d => d.id === doc.id)) {
    this.selectedDocs = this.selectedDocs.filter(d => d.id !== doc.id);
   
  }
  }

  
  delet(doc)
  {
  this.showselectedfile = this.showselectedfile.filter(d => d.id !== doc.id);
  
  
  }

  ShowSelectedFile(){
    this.showselectedfile=this.selectedDocs;
  }
 
  toggleIcon2(user) {
    user.showIcon = !user.showIcon;
    if (user.showIcon && !this.selecteduser.some(u => u.id === user.id)) {
      this.selecteduser.push(user);
     
  
    } else if (!user.showIcon && this.selecteduser.some(u => u.id === user.id)) {
      this.selecteduser = this.selecteduser.filter(u => u.id !== user.id);
     
    }
  }

  ShowSelecteduser(){
    this.showselecteduser=this.selecteduser;
  }
  deletuser(user)
  {
  this.showselecteduser = this.showselecteduser.filter(u => u.id !== user.id);
 
  }

  onPresentielChange(event: any) {
    const target = event.target;
    const col = target.closest('.col');
    if (target.checked) {
      const input = document.createElement('input');
      
      input.setAttribute('type', 'text');
      input.setAttribute('class','row');
      input.setAttribute('name', 'lieu');
      input.setAttribute('id', 'lieu');
      input.setAttribute('placeholder', 'Indiquez la salle');
      input.setAttribute('autofocus','true');
      
      col.appendChild(input);
  
      const css = "#lieu { display: inline-block; margin-left:5px; background-color: transparent !important; outline: none !important; border:none; border-bottom:1px solid #CCC; height:30px;}";
      col.insertAdjacentHTML('beforeend', '<style>' + css + '</style>');
    } else {
      const input = document.getElementById('lieu');
      if (input) {
        col.removeChild(input);
        const css = "#lieu { display: inline-block; margin-left:5px;background-color: transparent !important; outline: none !important; border:none; border-bottom:1px solid #CCC; height:30px;}";
        const style = document.querySelector('style');
        style.sheet.deleteRule(0);
      }
    }
    
  }


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
    { this.nbrep='';
    this.typerep='';
      this.typerepaff='';
      this.nbrepaff='';
      this.heuredaff=' de '+this.heured;
      this.heurefaff=' à '+this.heuref;
      this.datefFormatee='';
      
    }
  }

  /* afin  de changer la date de fin */

  onDateDebutChange(){
   // Récupérer la date de début sélectionnée
   const dateDebut = new Date(this.dateDebut);
  
   // Définir la date minimale pour la date de fin sur la date de début sélectionnée
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
  } else {
    this.selectedDays.splice(index, 1);
  } 
}

/* vider le tab  qui contient les jours de la semaine selectionnées lors de changement de type rep */
onChangeRepeatType() {
  this.selectedDays = [];
}

/*fonction pour choisir le formateur*/
filterTrainers() {
  this.users.subscribe(users => {
    this.filtertrainers = users.filter(user => user.username.toLowerCase().includes(this.searchText.toLowerCase()));
    
  });
}


selectTrainer(user) {
  this.selectedTrainer =user.username;
  
}
Search() {

  if (this.formSearch.filtre === "nom-doc") {
    
  this.documents = this.gestionDocService.getDocByTit(this.formSearch.rech.toLowerCase());
    
    }

  if (this.formSearch.filtre  === "poste") {
    
   this.documents = this.gestionDocService.getDocByDep(this.formSearch.rech.toUpperCase());
    
  }
    
  if (this.formSearch.filtre  === "tag") {
    
   this.documents = this.gestionDocService.getDocByTag(this.formSearch.rech.toLowerCase());
    
  }
    
  if (this.formSearch.filtre  === "vide" || this.formSearch.filtre  === null || this.formSearch.rech === null || this.formSearch.rech === '' || this.formSearch.rech === undefined) {
    
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

    onSubmit() {
      const users: User[] = this.showselecteduser as User[];
      const plans: FormationPlan[] = this.formPplan as FormationPlan[];
      const name:string =this.form.name;
      const IDformationsPlan: number[]=[7,4];
      const IDparticipants: number[]=[51,50];
      const  departements : String[]=this.Deps
      const formDataP = { 
        name: name,
        IDparticipants: users.length > 0 ? users.map(user => user.id) : null,
        IDformationsPlan: plans.map(plan => plan.id),
        departements: this.Deps
      };
    
      this.gestionLotService.planifierLot(formDataP).subscribe(
        res => {
          this.valid = true;
          this.messagevalid = ("Lot planifié avec succés");
          setTimeout(() => {
            this.router.navigate(['/formations']) ;
          }, 2000);
    },
    (error) => {
      this.failed = true;
      this.errorMessage = ("Echec : Nom du lot existe déjà" );
      setTimeout(() => {
      this.failed = false;
        }, 1500);
    }
  );
    }
  
      
selectPlan(plan: any) {
      const index = this.formPplan.findIndex((p: any) => p.id === plan.id);
      this.showselecteduser = this.showselecteduser.map((user: any) => {
         user.p = '../../assets/images/photoParDefaut.jpg';
        if (user.photo) {
        const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
         user.p = API + 'api/gestion/PDP/' + fileName;
         }return user;});
      if (index === -1) {
        this.formPplan.push(plan);
        this.Formateurs.push(plan.formateur.username);
        plan.documents.forEach((doc: any) => {
          this.showselectedfile.push(doc);
        });
        plan.participants.forEach((user: any) => {
          this.showselecteduser.push(user);
        });
      }
       else {
        this.formPplan.splice(index, 1);
        this.Formateurs.splice(index, 1);
        plan.documents.forEach((doc: any) => {
          this.showselectedfile.splice(index, 1);
        });
    
        plan.participants.forEach((user: any) => {
          this.showselecteduser.splice(index, 1);
        });
       }
    }
isSelected(plan: any): boolean {
  return this.formPplan.some((p: any) => p.id === plan.id);
}



}
