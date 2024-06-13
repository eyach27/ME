import { Component, OnInit ,HostBinding, ViewChild, ElementRef} from '@angular/core';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ThemeService } from '../../theme.service';
import { Router } from '@angular/router';
import { DepartmentService } from 'src/app/department/DepartmentService';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { GestionDocService } from 'src/app/GestionDoc/gestion-doc.service';
import { Observable, map } from 'rxjs';
import { Department } from 'src/app/department/departement';
import { environment } from 'src/environments/environment';
import { gestionFormService } from '../gestion-form.service';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Formation } from '../formation';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { User } from 'src/app/GestionUser/user';
const API = `${environment.apiBaseUrl }`;
@Component({
  selector: 'app-creation-formation',
  templateUrl: './creation-formation.component.html',
  styleUrls: ['./creation-formation.component.scss']
})
export class CreationFormationComponent implements OnInit 
{ @ViewChild('nomformation') nomformation!: ElementRef;
  
  
  closeResult: string;

 
  currentIconClass='bx bx-check-square';

  @HostBinding('class') componentClass = 'light';

  isLoggedIn = false;
  mode: string;

  departments: any[];
  selectedDepartment: string;
  selectedDepartments: string[] = [];
  Deps: string[] = [];
  Tags: string[] = [];
  documents: Observable<any[]> | any;
  selectedDocs: any[] = [];
  showselectedfile: any[] = [];

  selectedIndex: number = -1;
  form:any={name:null,type:null};
  formName: string;
 formation : any;

 searchText: string='';
 filtertrainers: any[];
 
 

 users: Observable<any[]>;

 nameformation:string;
 selectedTrainer: string ='formateur.inonnu';
 selectedIDtrainer:string;
 test:any;
 formateurDefaut: any[];
 message: string;
 valid: boolean=false;
 failed=false;
 errorMessage: string;
 formSearch={
  filtre:'nom-doc',
  rech:'',
 }
 


  constructor(private gestionFormationService: gestionFormService,private gestionDocService: GestionDocService,private tokenStorageService : TokenStorageService,private router: Router,private themeService: ThemeService, private departementService:DepartmentService,private modalService: NgbModal,private userServiceGestService: UserServiceGestService){
    this.themeService.observeMode().subscribe(mode => {
       
      this.componentClass = mode;
       
       });

      
  }
  ngAfterViewInit() {
    this.nomformation.nativeElement.focus();
  }
 
  async ngOnInit(): Promise<void> {
         
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
    }
    await this.departementService.getAllDepartments().toPromise().then((data: any[]) => {
      this.departments = data;
    }); 
 
  
    await this.reloadData();
    await this.GetDefaultformateurID();;
  
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
        }).sort((a, b) => a.firstname.localeCompare(b.firstname)); // trier par ordre alphabétique du nom
      })
    );
  }
  onSubmit() {

    const selectedDepartments = this.departments.filter(dep => dep.selected).map(dep => dep.id);
    const selectedDocs = this.showselectedfile.map(doc => doc.id);
    const formData = new FormData();
    formData.append("name", this.form.nameformation.toLowerCase());
   
    formData.append("formateur", this.selectedIDtrainer);

    if (selectedDocs!=null){

      for (var j = 0; j < this.selectedDocs.length; j++){
        formData.append("documents", selectedDocs[j]);
      }
    }
   
    if (selectedDepartments.length > 0) {
      for (var j = 0; j < selectedDepartments.length; j++) {
        formData.append("departements", selectedDepartments[j]);
      }
    }
    
    this.gestionFormationService.createForm(formData).subscribe(
      res => {
       
      this.valid = true;
              this.message = ("Formation crée avec succèss.");
              setTimeout(() => {
                this.router.navigate(['/formations']);
                }, 1500);
        
     
    },
    
    err => {
     
      this.failed = true;
              this.errorMessage = ("Echec : Nom de la formation existe déja");
              setTimeout(() => {
                this.failed = false;
              }, 1500);
            })
    }
  

  onDepartmentSelected(selectElement: EventTarget) {
    const select = selectElement as HTMLSelectElement;
    const selectedValue = select.value;
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

  /*fonction pour choisir le formateur*/
filterTrainers() {
  this.users.subscribe(users => {
    this.filtertrainers = users.filter(user => user.username.toLowerCase().includes(this.searchText.toLowerCase()));
  });
}

GetDefaultformateurID(){
  this.users.subscribe(users => {
    this.formateurDefaut = users.filter(user => user.username=="FORMATEUR.INCONNU");
    this.selectedIDtrainer=this.formateurDefaut[0].id; 
   
   
  });

}


selectTrainer(user) {
  this.selectedTrainer =user.username;
  this.selectedIDtrainer=user.id;
  this.reloadData();
}


async Search() {
  if (this.formSearch.filtre === 'nom-doc') {
    if (this.formSearch.rech && this.formSearch.rech.trim() !== '') {
      this.documents = await this.gestionDocService.getDocByTit(this.formSearch.rech.toLowerCase()).toPromise();
    } else {
      this.reloadData();
    }
  }

  if (this.formSearch.filtre === 'poste') {
    if (this.formSearch.rech && this.formSearch.rech.trim() !== '') {
      this.documents = await this.gestionDocService.getDocByDep(this.formSearch.rech.toUpperCase()).toPromise();
    } else {
      this.reloadData();
    }
  }

  if (this.formSearch.filtre=== 'tag') {
    if (this.formSearch.rech && this.formSearch.rech.trim() !== '') {
      this.documents = await this.gestionDocService.getDocByTag(this.formSearch.rech.toLowerCase()).toPromise();
    } else {
      this.reloadData();
    }
  }

  if (this.formSearch.filtre === 'vide' || !this.formSearch.filtre || !this.formSearch.rech || this.formSearch.rech.trim() === '') {
    this.reloadData();
  }
}

    
}
  