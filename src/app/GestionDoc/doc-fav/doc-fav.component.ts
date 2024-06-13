import { Component, HostBinding, OnInit } from '@angular/core';
import { ThemeService } from '../../theme.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { GestionDocService } from '../gestion-doc.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { User } from 'src/app/GestionUser/user';
import { DomSanitizer } from "@angular/platform-browser";
import {filter} from 'rxjs/operators';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { Department } from 'src/app/department/departement';
import { DepartmentService } from 'src/app/department/DepartmentService';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;
var myfile = [];


@Component({
  selector: 'app-doc-fav',
  templateUrl: './doc-fav.component.html',
  styleUrls: ['./doc-fav.component.scss']
})
export class DocFavComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';

  form:any={name:null,type:null,departements: null};
  Tags: string[] = [];
  Deps: string[] = [];
  p: number = 1;
  count: number = 25;
  searchText;
  
  closeResult: string;  
  
  documents: Observable<any[]> | any;
  doc:any;
  id: number;
  isfav: boolean;
  idu:number;
  user:User;
  
  retrieveResonse: any;
  base64Data: any;
  retrievedFile: any;
  
  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard:boolean;
 showUserboard:boolean;
 showFormboard:boolean;
  showicon:boolean=true;
  showcontenu:boolean;
  userid:any;
  departments: any[];

  selectedDepartment: string;
  selectedDepartments: string[] = [];
  
  selectedIndex: number = -1;
  mode: string;
  selectedDocs: any[] = [];
  message: string;
  test: boolean=false;
  failed=false;
  errorMessage: string;
  favoris: boolean = false;
  formSearch= {
    filtre: 'titre',
    rech: ''
  };
    constructor(private departementService:DepartmentService ,private httpClient: HttpClient,private route: ActivatedRoute,private userService: UserServiceGestService, private gestionDocService: GestionDocService,private router: Router,private modalService: NgbModal, private tokenStorageService : TokenStorageService,    private sanitizer: DomSanitizer,
      private themeService: ThemeService )
      { this.themeService.observeMode().subscribe(mode => {
     this.componentClass = mode;});
    }
  
      ngOnInit() {
        
        this.departementService.getAllDepartments().subscribe((data: any[]) => {
          this.departments = data;
        });
          if (this.tokenStorageService.getToken()) {
            this.isLoggedIn = true;
           
      this.user=this.tokenStorageService.getUser()
        this.userid = this.user.id;
        this.reloadData();
       
        this.idu=this.tokenStorageService.getId();
      this.roles = this.tokenStorageService.getUser().roles;
      this.showAdminBoard=this.tokenStorageService.getUser().roles.includes('ROLE_ADMIN');
      this.showUserboard=this.tokenStorageService.getUser().roles.includes('ROLE_USER');
      this.showFormboard=this.tokenStorageService.getUser().roles.includes('ROLE_FORMATEUR')

    } }
  
    toggleIcon(doc) {

      doc.showIcon = !doc.showIcon;
     
    
      if (doc.showIcon && !this.selectedDocs.some(d => d.id === doc.id)) {
     
      this.selectedDocs.push(doc);
     
      console.log("ajouter a la liste");
  
      } else if (!doc.showIcon && this.selectedDocs.some(d => d.id === doc.id)) {
     
      this.selectedDocs = this.selectedDocs.filter(d => d.id !== doc.id);
     
      console.log("supprimer de la liste");
      }
     }
     
    downloadmultidoc(){
      
      for(let doc of this.selectedDocs){
      
     this.downloadDoc(doc.id,doc.name);
      
      }
      
      }
      
     deleteadmultidoc(content , id){
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => { 
      this.closeResult = `Closed with: ${result}`; 
     if (result === 'yes') {
      
    for(let doc of this.selectedDocs){
      
      this.deleteDoc(doc.id); }
   
    } 
   }, (reason) => { 
      
     this.closeResult = `Dismissed ${this.getDismissReason(reason)}`; 
    }); 
   }
  
      reloadData() {
       this.documents = this.gestionDocService.getDocListFav(this.userid);
       this.documents.subscribe((docs) => {
        for (const doc of docs) {
          doc.name=doc.name.split('.')[0];
          this.gestionDocService.getDepartementsByDocId(doc.id).subscribe((departments: Department[]) => {
            doc.departments = departments;
            doc.departmentsNames = departments.map((dep: Department) => dep.name);
          });
        }
        this.documents = docs;
      });
}
  
     fromfav(doc:any){
      if(this.user.doc_favoris.indexOf(doc)!= -1){
      
        this.user.doc_favoris.splice(this.user.doc_favoris.indexOf(doc),1);
      
      //  this.tokenStorageService.saveUser(this.user);
        this.reloadData();
      }
      else{}
        this.httpClient.delete(API+'api/favorite/doc/'+this.user.id+'/'+doc.id)
        .subscribe(
          data => {
             this.reloadData();
            this.test=true;
            this.message=('Document retiré du votre favoris');
            setTimeout(() => {
              this.test=false;
                 }, 1500);
           
           
            }, 
          error => {console.log(error);
            this.failed=true;
              this.errorMessage='Erreur: document non retiré';
              setTimeout(() => {
                this.failed = false;
              }, 1500);
            }
          );
        this.favorita(doc);

    }

      deleta(doc:any){
        if( this.tokenStorageService.getUser().username==doc.owner ){return true;}
        else{return false;}
      }

      
      i:number;

      favorita(doc){
        this.i = 0;
      this.user.doc_favoris?.forEach(ff =>  {
     if(ff.id == doc.id){
          this.i++;
        }
      });
      if( this.i == 0 ){return false;}
      else{return true;}
      }
  
      deleteDoc(id: number) {
        this.gestionDocService.deleteDoc(id)
          .subscribe(
            data => {
             
              this.reloadData();
            },
            error => console.log(error));
      }
  
      Icone(){
        this.showicon=true;
        this.showcontenu=false;
      }
      
      Contenue(){
        this.showcontenu=true;
        this.showicon=false;
      }

      downloadDoc(id: number,titre : string) {
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
  
      open(content, id) {  
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
          this.closeResult = `Closed with: ${result}`;  
          if (result === 'yes') {  
            this.deleteDoc(id);  
          }  
        }, (reason) => {  
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
        });  
      }  
      
      opene(contente,id) {  
        this.doc = new Document();
        this.gestionDocService.getDoc(id)
        .subscribe(data => {
        
          this.doc = data;
          this.form['extension'] =this.doc.name.split('.')[1];
          this.doc.name=this.doc.name.split('.')[0];
          this.form['name']=this.doc.name.split('.')[0] ;
          this.form['type']=this.doc.contentType;
          this.form['departements']=this.doc.departements;
  
          for(var i=0;i<this.doc.tags.length;i++){
          this.Tags.push(this.doc.tags[i].libelle);
         
        }
          this.id=id;
        }, error => console.log(error));
  
        this.modalService.open(contente, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
          this.closeResult = `Closed with: ${result}`;  
          if (result === 'yes') {  
            this.updateDoc();  
          }  
        }, (reason) => {  
          this.Tags=[];  
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
        });  
      }  
  
      private getDismissReason(reason: any): string {  
        if (reason === ModalDismissReasons.ESC) {  
          this.Tags=[]; 
          return 'by pressing ESC';  
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) { 
          this.Tags=[];   
          return 'by clicking on a backdrop';  
        } else {  
          this.Tags=[];  
          return `with: ${reason}`;  
        }  
      }  
      
      updateDoc() {
        let {name,contentType,extension} = this.form;
        let {id}=this.doc.id;
  
        const formData = new FormData();
        formData.append("id",id);
        formData.append("titre",name+ '.' + extension);
  
      for (var j=0;j<this.Deps.length;j++){
        formData.append("dep",this.Deps[j]);
    }
    
   
      for (var j=0;j<this.Tags.length;j++){
        formData.append("tags",this.Tags[j]);}
        
      this.httpClient.put(API+'document/update/'+this.doc.id,formData)
      .subscribe(
        data => {
          this.doc = new Document();
            this.reloadData();
            this.test=true;
            this.message= 'Document modifié avec succcés.'; 
            setTimeout(() => {
              this.test = false;
            }, 2000);
          this.Tags=[];
          this.Deps=[];
          this.selectedDepartment= "";
          this.selectedDepartments=[];
          this.selectedIndex = -1;
          }, 
        error => {console.log(error);
          alert("Modification échouée essayer autrement, peut etre le nom du fichier " + name + " existe déja  " );
          this.Tags=[];
          this.Deps=[];
          this.selectedDepartment= "";
          this.selectedDepartments=[];
          this.selectedIndex = -1;
       
        }
        ); } 
    
      retour(){
        this.router.navigate(['doc-view']);
        this.Tags=[];  

      }
  
      //afficher doc
      afficher(id: number) {
        this.gestionDocService.getDoc(id).subscribe(
          (res) => {

         console.log(API+"document/name/"+res.path.substr(res.path.indexOf('/uploads/')+9,res.path.length));
         window.open(API+"document/name/"+res.path.substr(res.path.indexOf('/uploads/')+9,res.path.length));
      
        });
      }
  
      _base64ToArrayBuffer(base64Data) {
        const binary_string = window.atob(base64Data);
        const len = binary_string.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        return bytes.buffer;
      }
  
      visible = true;
      selectable = true;
      removable = true;
        
    
      readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
   
      add(event: MatChipInputEvent): void {
    
        const input = event.input;
        const value = event.value;
        if ((value || '').trim()) {  
    
          this.Tags.push(value);
        }
        if (input) {
    
          input.value = '';
        }
      }
   
      remove(tag: string): void {
        const index = this.Tags.indexOf(tag);
        if (index >= 0) 
        {
          this.Tags.splice(index, 1);
        }
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
      
      isDepartmentSelected(department: any) {
        return this.selectedDepartments.includes(department.name);
      }
      
      Search() {        
       if (this.formSearch.filtre === 'titre') {
        
        this.documents = this.documents.filter((doc) => doc.name.toLowerCase().includes(this.formSearch.rech.toLowerCase()));
        
       }
        
       if (this.formSearch.filtre === 'type') {
        
       this.documents = this.documents.filter((doc) => doc.contentType.toLowerCase().includes(this.formSearch.rech.toLowerCase()));
      }
        
      if (this.formSearch.filtre === 'tag') {
        
      this.documents = this.documents.filter((doc) => doc.tags.some((tag) => tag.libelle.toLowerCase().includes(this.formSearch.rech.toLowerCase())));
        
      }
        
      if (this.formSearch.filtre === "vide" || this.formSearch.filtre === null || this.formSearch.rech === null || this.formSearch.rech === '' || this.formSearch.rech === undefined) {
        
      this.reloadData();
        
      }
        
      }
      
         
  }