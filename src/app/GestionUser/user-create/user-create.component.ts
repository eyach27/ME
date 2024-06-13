import { Component, OnInit ,HostBinding} from '@angular/core';
import { Router } from '@angular/router';
import { UserServiceGestService } from '../user-service-gest.service';
import { User } from "./../user";

import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { DepartmentService } from 'src/app/department/DepartmentService';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';

  roles: string[]=[];
  msg='';
  departments: any[];
  form: any = {
    firstname:'',
    lastname:'',
    username: null,
    email: null,
    password: null,
    poste: "",
    roles:null
     

    // Add new property for roles
  };

  isLoggedIn = false;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = 'componenets ts ';
  isAdmin: boolean = false;
  isUser: boolean = true;
  isFormateur: boolean = false;
  mode: string;
  test=true;

  constructor(private userServiceGestService: UserServiceGestService,private tokenStorageService : TokenStorageService,
    private router: Router, private departementService:DepartmentService,private themeService: ThemeService ) { 
  
      this.themeService.observeMode().subscribe(mode => {
       
      this.componentClass = mode;
       
       });}

  ngOnInit(): void {
    this.departementService.getAllDepartments().subscribe((data: any[]) => {
      this.departments = data;
    });
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      }
    
  }
  onCheckboxChange(role: string, event: Event) {
    const checkbox = (event.target as HTMLInputElement);
    const isChecked = checkbox.checked;
    this.isAdmin = false;
    this.isUser = false;
    this.isFormateur = false;
    if (isChecked) {
      this.roles = [role];
      switch (role) {
        case 'admin':
          this.isAdmin = true;
          break;
        case 'user':
          this.isUser = true;
          break;
        case 'formateur':
          this.isFormateur = true;
          break;
      }
    } else {
      this.roles = [];
    }
}
onSubmit(): void {
this.form.roles = this.roles;
  const { firstname, lastname, username, email, password, poste,roles } = this.form;
 
    this.userServiceGestService.registerAdmin(firstname, lastname, username, email, password, poste, roles)
      .subscribe(
        data => {
          this.isSuccessful = true;
          this.isSignUpFailed = false;
          setTimeout(() => {
            this.router.navigate(['/user-list']);
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
