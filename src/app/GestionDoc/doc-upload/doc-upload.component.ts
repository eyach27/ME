import { HttpClient } from '@angular/common/http';
import { Component, OnInit ,HostBinding } from '@angular/core';
import { Router } from '@angular/router';
import { ViewChild, ElementRef } from "@angular/core";
import {GestionDocService} from '../gestion-doc.service';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {COMMA, ENTER, SPACE} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import { Tag } from '../tag';
import { DepartmentService } from 'src/app/department/DepartmentService';
import { ComponentFactoryResolver, ViewContainerRef, EventEmitter, Input, Output} from '@angular/core';
  import {HttpResponse, HttpEventType} from '@angular/common/http';
  import {fromEvent, Observable} from 'rxjs';
  import {FileItem, FileUploader} from "ng2-file-upload";
  import {debounceTime, distinctUntilChanged, map, switchMap, tap} from "rxjs/operators";
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ThemeService } from '../../theme.service';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;


@Component({
  selector: 'app-doc-upload',
  templateUrl: './doc-upload.component.html',
  styleUrls: ['./doc-upload.component.scss']
})


export class DocUploadComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';
  isLoading = false;
  closeResult: string;  
doc:any;
departments: any[];
private roles: string[] = [];
isLoggedIn=false;
mode: string;
  constructor(private GestionDocService: GestionDocService, 
    private router: Router,private httpClient: HttpClient , private modalService: NgbModal,private tokenStorageService :TokenStorageService,private departementService: DepartmentService,
    private themeService: ThemeService ) {  this.themeService.observeMode().subscribe(mode => {
      this.componentClass = mode;});}
       
    
  ngOnInit(): void { 
    this.departementService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    });
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      
    this.roles = this.tokenStorageService.getUser().roles;
    this.showAdminBoard = this.roles.includes('ROLE_ADMIN');

  }}
  

@ViewChild("fileDropRef", { static: false }) fileDropEl: ElementRef;
files: any|Blob[] = [];
message='';
name:string;
Tags: string[] = [];
Deps: string[] = [];
dep:string=null;
form: any = {dep: null};
showAdminBoard = false;
errorMessage = '';
isuploaded:boolean=true;
test:boolean=false;

// on file drop handler
onFileDropped($event) {
  this.prepareFilesList($event);}


 // handle file from browsing
 fileBrowseHandler(files) {
  this.prepareFilesList(files);}

/** * Delete file from files list
 * @param index (File index) */
deleteFile(index: number) {
  if (this.files[index].progress < 100) {
    return; }
  this.files.splice(index, 1);}
  
  
 // Simulate the upload process
uploadFilesSimulator(index: number) {
  setTimeout(() => {
    if (index === this.files.length) {
      return;
    } else {
      const progressInterval = setInterval(() => {
        if (this.files[index].progress === 100) {
          clearInterval(progressInterval);
          this.uploadFilesSimulator(index + 1);
        } else {
          this.files[index].progress += 5;
        }
      }, 50);
    }
  }, 500);
}

/*** Convert Files list to normal array list
 * @param files (Files List)*/
prepareFilesList(files: Array<any>) {
  for (const item of files) {
    item.progress = 0;
    this.files.push(item);  }
  this.fileDropEl.nativeElement.value = "";
  this.uploadFilesSimulator(0);}

formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];}

submit(){
  const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
  const newName = nameInput.value;
  let {name} = this.form;
if (!name) {
  name = this.files[0].name;
}

const formData = new FormData();
  for (var i = 0; i < this.files.length; i++) { 
    formData.append("files", this.files[i]); 
   
    formData.append("name", newName);
    for (var j=0;j<this.Tags.length;j++){
        formData.append("tags",this.Tags[j]);
    }
   
  }
   
    if (this.Deps!=null){

      for (var j = 0; j < this.Deps.length; j++){
        formData.append("dep", this.Deps[j]);
      }
    }
    if (this.Deps.length == 0) {
      const dep = this.tokenStorageService.getUser().poste;
      this.Deps.push(dep);
      formData.append("dep", this.Deps[0]);
    }

 
 this.isLoading = true;
  this.httpClient.post(API+'document/upload', formData)
  .subscribe(
    res => {console.log(res);
    
   this.isLoading = false;
    
    this.message= 'Document ajouté avec succéss'
    
   this.test=true;
    
  setTimeout(() => {
    
  // Navigate to "doc view" component
    
     this.router.navigate(['/doc-view']);
    
     }, 1500);
    
   },
   err => {
    
 this.isLoading = false;
  this.isuploaded = false;
    
  this.errorMessage = err.error.message;
     setTimeout(() => {
     this.isuploaded = true;
  this.router.navigate(['/doc-upload']);
   }, 2000);

}) }

open(content, i) {  
  this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
    this.closeResult = `Closed with: ${result}`;  
    if (result === 'yes') {  
       this.add(i);
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

visible = true;
selectable = true;
removable = true;
  
tagAdded = false;



readonly separatorKeysCodes: number[] = [ENTER, COMMA, SPACE];
add(event: MatChipInputEvent): void {
  const input = event.input;
  const value = event.value;
  if ((value || '').trim()) {  
    this.Tags.push(value);
    this.tagAdded = true;
  }
  if (input) {input.value = '';}
}


remove(tag: string): void {
  const index = this.Tags.indexOf(tag);
  if (index >= 0) 
  {this.Tags.splice(index, 1);}
}



selectedDepartment: string;
selectedDepartments: string[] = [];

selectedIndex: number = -1;

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

}

