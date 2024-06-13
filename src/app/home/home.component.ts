import { Component, OnInit , ViewChild, ElementRef, AfterViewInit, Renderer2} from '@angular/core';
import { AuthService } from '../_services/user-auth.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../GestionUser/user';
import { UserServiceGestService } from 'src/app/GestionUser/user-service-gest.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { ENTER, COMMA, SPACE } from '@angular/cdk/keycodes';
import { HttpClient } from '@angular/common/http';
import { ModalDismissReasons, NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GestionDocService } from '../GestionDoc/gestion-doc.service';
import { environment } from 'src/environments/environment';
import { DepartmentService } from '../department/DepartmentService';
const API = `${environment.apiBaseUrl }`;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit , AfterViewInit {
  @ViewChild('usernameInputIN') usernameInputIN!: ElementRef;
 
  /*POUR SIGNUP*/
  msg='';
  departments: any[];
  form: any = {
    firstname:'',
    lastname:'',
    username:null,
    email:null, 
    password: null,
    poste:'',
    role:null,
  };
  Srole: string[]=["user"];
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  test=true;
  bouton:any;
  /*********************/
  

  /*POUR LOGIN */
  formin: any = {};
  isLoggedIn = false;
  isLoginFailed =true;
  roles: string[] = [];
  errorMessage_login = '';
  usernameIN="";


  currentIconClass='bx bx-low-vision';
  



  constructor(private authService: AuthService, private tokenStorage: TokenStorageService, private router: Router, private departementService:DepartmentService , private renderer: Renderer2, private el: ElementRef) { }  
  ngAfterViewInit(): void {
    this.usernameInputIN.nativeElement.focus();
  }


  ngOnInit(): void 
  {
    
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('containerr');
  
    signUpButton.addEventListener('click', () => {
      container.classList.add("right-panel-active");
    });
    signInButton.addEventListener('click', () => {
      container.classList.remove("right-panel-active");
    });
      /*********************/
      this.departementService.getAllDepartments().subscribe((data: any[]) => {
        this.departments = data;
      });

    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.usernameIN=this.tokenStorage.getUser().usernameIN;
    }
  }


  /***********login***********/
 
  onSubmitin(): void {
    const { usernameIN, passwordIN } = this.formin;

    this.authService.login(usernameIN, passwordIN).subscribe(
      next => {
        this.tokenStorage.saveToken(next.accessToken);
        this.tokenStorage.saveUser(next);
        this.roles = this.tokenStorage.getUser().roles;
        this.usernameIN=this.tokenStorage.getUser().usernameIN;
        this.isLoggedIn = true;
        this.isLoginFailed = false;
        if (this.roles.includes('ROLE_USER')) {
          this.router.navigate(['/mes-documents']);
        }
        else if (this.roles.includes('ROLE_FORMATEUR')){
          this.router.navigate(['/mes-formations']);
        } 
        else {
          this.router.navigate(["/stattics"]);
        }
      },
      err => {
        
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        if (err.error.message ==="Bad credentials" )
        {
          this.errorMessage="données érronées , merci de les vérifier.";}
      }
      
    );
  }
  /***************************/



    /**************signup*************/

  onSubmit(): void {
    this.form.role = this.Srole;
   const {firstname,lastname, username, email, password,poste} = this.form;
 
   this.authService.register(firstname,lastname,username, email, password,poste, this.form.role).subscribe(
     data => {
       console.log(data);
       this.isSuccessful = true;
       this.isSignUpFailed = false;
       this.msg="Votre compte est crée avec succée";
       this.router.navigate(['/home']);
       setTimeout(() => {
         this.isSuccessful = false;
       }, 2000);
     },
     err => {
       this.errorMessage = err.error.message;
       this.isSignUpFailed = true;
       this.test=false;
       this.form= {
         firstname:'',
         lastname:'',
         username:null,
         email:null, 
         password: null,
         poste:null,
         role:null,
       };
       setTimeout(() => {
         this.isSignUpFailed = false;
       }, 2500);
     }
   );
 }


 togglePasswordVisibility() {

   const passwordField = this.el.nativeElement.querySelector('#passwordIN');
   
   const showButton = this.el.nativeElement.querySelector('#showButton');
 
   if (passwordField.type === 'password') {
   
    this.renderer.setAttribute(passwordField, 'type', 'text');
   
    this.bouton.showIcon = true;
   
showButton.textContent = 'Hide';
   
  } else {
   
this.renderer.setAttribute(passwordField, 'type', 'password');
   
  this.bouton.showIcon = false;
   
  showButton.textContent = 'Show';
   
   }
   
   }
   generateUsername(): string {
    const firstNameWithoutSpaces = this.form.firstname.replace(/\s/g, '');
    const lastNameWithoutSpaces = this.form.lastname.replace(/\s/g, '');
    this.form.username=firstNameWithoutSpaces + '.' + lastNameWithoutSpaces;
    return firstNameWithoutSpaces + '.' + lastNameWithoutSpaces;
  }
  
  generateEmail(): string {
    const firstNameWithoutSpaces = this.form.firstname.replace(/\s/g, '');
    const lastNameWithoutSpaces = this.form.lastname.replace(/\s/g, '');
    this.form.email=firstNameWithoutSpaces + '.' + lastNameWithoutSpaces + '@neoxam.com';
    return firstNameWithoutSpaces + '.' + lastNameWithoutSpaces + '@neoxam.com';
  }
  
   
   }
