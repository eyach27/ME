import { Component, OnInit , HostBinding} from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserServiceGestService } from '../GestionUser/user-service-gest.service';
import { User } from '../GestionUser/user';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { DepartmentService } from '../department/DepartmentService';
import { ThemeService } from '../theme.service';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;
import { updateRequest } from '../../app/GestionUser/user-update/updateRequest';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

   @HostBinding('class') componentClass = 'light';
  profilePhotoUrl = '../../assets/images/photoParDefaut.jpg';
  currentUser: any;
  closeResult: string;  
  id: number;
  user: any;
  users: Observable<User[]>;
  role:string;
  showAdminBoard:boolean=false;
  showformateurBoard=false;
  showuserBoard=false;

  photoDeProfileUrl: string;
  isLoggedIn=false;
  departments: any[];
  mode: string;
  formValid: any;
  firstname:string;
  lastname:string;
  nuser:updateRequest=new updateRequest();
  msg:string='';
  test:boolean=false;
  errormsg: string;
  errortest: boolean=false;
//profilePhotoUrl: string = '';
constructor(private http: HttpClient,private route: ActivatedRoute,private router: Router,private departementService :DepartmentService,

  private userServiceGestService: UserServiceGestService,private modalService: NgbModal,private token: TokenStorageService ,private themeService: ThemeService ) { 
  
 this.themeService.observeMode().subscribe(mode => {
  
 this.componentClass = mode;
  
  });}
    selectedFile: File;
  ngOnInit(): void {
    this.departementService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    });
   
    if (this.token.getToken()) {
      this.isLoggedIn = true;
      }
    this.currentUser = this.token.getUser();
    this.reloadData();
   
   this.user = new User();
    this.id=this.token.getId()
   this.userServiceGestService.getUser(this.id)
      .subscribe(data => {
        //console.log(data)
        this.user = data;
        this.firstname=this.user.firstname;
        this.lastname=this.user.lastname;
        
        for(let i=0;i<this.user.roles.length;i++){
          this.role=this.user.roles[i].name;
        }
        if (this.role=="ROLE_ADMIN"){
          this.showAdminBoard=true;
        }
        if(this.role=="ROLE-FORMATEUR")
        {
          this.showformateurBoard=true;

        }
        else
        {
          this.showuserBoard=true;

        }
       
      
        //console.log("this.user.photo   "+this.user.photo);
        if (this.user.photo) {
          const fileName = this.user.photo.substring(this.user.photo.lastIndexOf('/') + 1);
          //console.log(fileName); // Output: "nom.png"
          this.profilePhotoUrl =API+'api/gestion/PDP/'+fileName;

        }
      },       error =>  {
       
        this.errortest=true;
        this.errormsg='Erreur :'+ error; 
        });
        setTimeout(() => {
          this.errortest = false;
        }, 2500);
      }
      
  
 
  reloadData() {
    this.users = this.userServiceGestService.getUser(this.id);}
    onUpdatePhoto() {
      const formData = new FormData();
    
      formData.append('photo', this.selectedFile, this.selectedFile.name);


      if (this.user.photo) {
        this.http.get(API+'api/gestion/photo/delete/'+ this.id).subscribe(
        data => {
          //console.log(data);
          this.reloadData();
        },
        error =>  {
       
          this.errortest=true;
          this.errormsg='Erreur :'+ error; 
          });
          setTimeout(() => {
            this.errortest = false;
          }, 2500);
      }
      
      this.http.put(API+'api/gestion/users/'+ this.id + '/PDP', formData).subscribe(
        response => {
          this.test=true;
          this.msg='Photo mise à jour avec succès'; 
          setTimeout(() => {
            this.test = false;
          }, 2000);
          // Reload the user data and update the profile photo URL
          this.userServiceGestService.getUser(this.id).subscribe(data => {
            this.user = data;
            const fileName = this.user.photo.substring(this.user.photo.lastIndexOf('/') + 1);
            this.profilePhotoUrl =API+'api/gestion/PDP/'+fileName;
          });
        },
        error =>  {
       
          this.errortest=true;
          this.errormsg='Erreur de mise à jour de la photo'; 
          });
          setTimeout(() => {
            this.errortest = false;
          }, 2500);
    }
    deleteimage(){
      //console.log(this.user.photo);
      this.profilePhotoUrl = '../../assets/images/photoParDefaut.jpg';
      if (this.user.photo) {
      this.http.get(API+'api/gestion/photo/delete/'+ this.id).subscribe(
      data => {
        //console.log(data);
        this.reloadData();
      },
      error => {
       
        this.errortest=true;
        this.errormsg='Erreur :'+ error; 
        });
        setTimeout(() => {
          this.errortest = false;
        }, 2500);
      }

    }
    
  updateUser() {
    this.userServiceGestService.updateUser(this.id, this.user).subscribe(
      data => {
       // console.log(data);
       //this.user = new User();
        this.reloadData();
        this.test=true;
        this.msg='Compte modifié avec succcés'; 
        setTimeout(() => {
          this.test = false;
        }, 2000);
      
      }, 
      error =>  {
       
        this.errortest=true;
        this.errormsg='Erreur :'+ error; 
        });
        setTimeout(() => {
          this.errortest = false;
        }, 2500);
      }
  
 
  opene(contente) {  
    this.modalService.open(contente, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
           this.changeInput();
      }  
    }, (reason) => { 
      this.restinchanger() ;
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

  
  onFileSelected(event) {
    const allowedTypes = ['image/jpeg', 'image/png'];
    const file = event.target.files[0];
  
    if (allowedTypes.includes(file.type)) {
      this.selectedFile = file;
      this.onUpdatePhoto(); // Trigger the update immediately
    } else {
        this.errortest=true;
        this.errormsg='Le fichier doit être une image de type JPEG ou PNG .'; 
        };
        setTimeout(() => {
          this.errortest = false;
        }, 2500);}


 changeInput(){
    this.user.username=this.generateUsername();
    this.user.email=this.generateEmail();
    this.updateUser();
   
  }
  restinchanger() {
    this.user.firstname=this.firstname;
    this.user.lastname=this.lastname;
   // console.log(this.user.lastname);
    //console.log(this.user.firstname);

  }
  generateUsername(): string {
    const firstNameWithoutSpaces = this.user.firstname.replace(/\s/g, '');
    const lastNameWithoutSpaces = this.user.lastname.replace(/\s/g, '');
    this.user.username=firstNameWithoutSpaces + '.' + lastNameWithoutSpaces;
    return firstNameWithoutSpaces + '.' + lastNameWithoutSpaces;
  }
  
  generateEmail(): string {
    const firstNameWithoutSpaces = this.user.firstname.replace(/\s/g, '');
    const lastNameWithoutSpaces = this.user.lastname.replace(/\s/g, '');
    this.user.email=firstNameWithoutSpaces + '.' + lastNameWithoutSpaces + '@neoxam.com';
    return firstNameWithoutSpaces + '.' + lastNameWithoutSpaces + '@neoxam.com';
  }
}

