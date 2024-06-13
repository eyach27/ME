import { Component, OnInit ,HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';
import { Department } from './departement';
import { DepartmentService } from './DepartmentService';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import { updateRequest } from './updateRequest';
import { ThemeService } from '../theme.service';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';

  newdep:updateRequest=new updateRequest();
  dep: any;
  departments: any;
  closeResult: string;  
  deps: Observable<Department[]>;
  form: any = {dep: null};
  newDepartment : Department;
  p: number = 1;
  count: number = 11;
  searchText;
  isLoggedIn=false;
  mode: string;
  message: string;
  test: boolean=false;
  failed=false;
  errorMessage: string;
  constructor(private departmentService: DepartmentService, private tokenStorageService : TokenStorageService,
    private router: Router,private modalService: NgbModal , private themeService: ThemeService ) {  this.themeService.observeMode().subscribe(mode => {
      this.componentClass = mode;});}

  ngOnInit() {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      }
    this.reloadData();}

  reloadData() {
    this.deps = this.departmentService.getAllDepartments();}

  openDelete(content, id) {  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deletedep(id);  
      }  
    }, (reason) => {  
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

  deletedep(id: number) {
    this.departmentService.deleteDepartment(id)
      .subscribe(
        data => {
          this.reloadData();
        this.test=true;
        this.message=('Poste supprimer avec succés');
        setTimeout(() => {
         this.test=false;
            }, 1500);},
      
        error => {(console.log(error))
        this.failed=true;
        this.errorMessage=('la suppression de poste est échouée');
        setTimeout(() => {
         this.failed=false;
            }, 1500);},
        );
  }
  

 
  newDepartmentName: string;

openUpdate(updateDepartmentModal, id) {  
  this.newDepartmentName = "";
  this.modalService.open(updateDepartmentModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
    this.closeResult = `Closed with: ${result}`;  
    if (result === 'yes') { 
      let dep = { id: id, name: this.newDepartmentName } as Department;
      this.updatedep(id, dep);  
    }  
  }, (reason) => {  
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
  });  
}

updatedep(id: number , dep:Department) {
  this.departmentService.updateDepartment(id,dep)
    .subscribe(
      data => {
        this.reloadData(); 
        this.test=true;
        this.message=('Poste modifier avec succés');
        setTimeout(() => {
         this.test=false;
            }, 1500);},
      
        error => {(console.log(error))
        this.failed=true;
        this.errorMessage=('La modification de poste est échouée');
        setTimeout(() => {
         this.failed=false;
            }, 1500);},
        );
}

namedep:Department;
opencreate(createDepartmentModal) {  
  this.namedep = null;
  this.modalService.open(createDepartmentModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
    this.closeResult = `Closed with: ${result}`;  
    if (result === 'yes') { 
      
      this.createdep(this.namedep);  
    }  
  }, (reason) => {  
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
  });  
}

createdep(namedep : Department) {
  this.departmentService.createDepartment(namedep)
    .subscribe(
      data => {
        
        this.reloadData() ;
         this.test=true;
        this.message=('Poste ajouté avec succés');
        setTimeout(() => {
         this.test=false;
            }, 1500);},
      
        error => {(console.log(error))
        this.failed=true;
        this.errorMessage=('Ajout de poste échouée');
        setTimeout(() => {
         this.failed=false;
            }, 1500);},
        );

}
}
