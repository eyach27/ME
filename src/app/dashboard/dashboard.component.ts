import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../GestionUser/user';
import { UserServiceGestService } from '../GestionUser/user-service-gest.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ThemeService } from '../theme.service';
import { environment } from '../../environments/environment';
const API = `${environment.apiBaseUrl }`;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls : ['../../styles.scss']})
  
export class DashboardComponent implements OnInit {
  
  /*********/
  private menuState = new BehaviorSubject<boolean>(false);
  isMenuOpen = false;
  private roles: string[] = [];
  isLoggedIn = false;
  username: string;
  profilePhotoUrl = '../../assets/images/photoParDefaut.jpg';
  /*********/
  currentUser: any;
  closeResult: string;  
  id: number;
  user: any;
  users: Observable<User[]>;
  role:string;
  showAdminBoard = false;
  showFormateurboard=false;
  photoDeProfileUrl: string;
  showuserboard=false;
  modeaff:string;
  testclass:string;
  
  constructor(private tokenStorageService: TokenStorageService,private router: Router,private token: TokenStorageService
    , private userServiceGestService: UserServiceGestService, private themeService: ThemeService) { }
  
  ngOnInit(): void 
  {
     
    if(this.themeService.mode=='light')
    {
     this.modeaff='Mode Sombre';
     this.testclass='bx bx-moon icon';
    }
    else{
     this.modeaff='Mode Lumière';
     this.testclass='bx bx-sun icon';
    }
    console.log(this.themeService.mode);
    

  
    
    
    
    /****************POUR FAIRE LA DIFFERENCE ENTRE USER AND ADMIN*************/
   
    if (this.token.getToken()) {
      this.isLoggedIn = true;
      }
    this.currentUser = this.token.getUser();
    this.reloadData();
   
   this.user = new User();
    this.id=this.token.getId()
   this.userServiceGestService.getUser(this.id)
      .subscribe(data => {
        console.log(data)
        this.user = data;
        for(let i=0;i<this.user.roles.length;i++){
          this.role=this.user.roles[i].name;
        }
        if (this.role=="ROLE_ADMIN"){
          this.showAdminBoard=true;
     
        }
        else this.showAdminBoard=false;
    console.log("showAdminBoard :  "+this.showAdminBoard);

    if (this.role=="ROLE_USER"){
      this.showuserboard=true;
    }
    else this.showuserboard=false;
    if (this.role=="ROLE_FORMATEUR" ||this.role=="ROLE_ADMIN")

 {

 this.showFormateurboard=true;

 }

 else this.showFormateurboard=false;
     if (this.user.photo) {

      this.profilePhotoUrl = API+'api/gestion/PDP/'+this.user.photo.substring(this.user.photo.lastIndexOf('/') + 1);

    }
   });

      // pour afficher les sous taches de l elements parent

    let arrow = document.querySelectorAll(".arrow");
    for (var i = 0; i < arrow.length; i++) {
        arrow[i].addEventListener("click", (e)=>{
            let arrowParent = (e.target as HTMLElement).parentElement?.parentElement;//selecting main parent of arrow
            let subMenus = document.querySelectorAll(".sub-menu");
            for (var j = 0; j < subMenus.length; j++) {
                if (subMenus[j].parentElement !== arrowParent) {
                    subMenus[j].parentElement.classList.remove("showMenu");
                }
            }
            arrowParent.classList.toggle("showMenu");
        });
    }


    // open and close the menu 
    let sidebar = document.querySelector(".sidebar");
    let sidebarBtn = document.querySelector(".toggle");
    sidebarBtn.addEventListener("click", ()=>{
    sidebar.classList.toggle("close");
    });



    // Dark mode and Light mode
   /* Dark mode and Light mode
    const icon = document.getElementById('changemode');
    const body = document.body;
    const modeText = body.querySelector(".mode-text");
    const menu = body.querySelector(".menu-text");
    const localStorageKey = "mode";
   
    // get the mode from localStorage, or default to light mode
    const storedMode = localStorage.getItem(localStorageKey);
    const mode = storedMode || "light";
   
    // set the body class and icon based on the mode
    if (mode === "dark") {
      body.classList.add('dark');
      icon.classList.add("bx-sun");
      icon.classList.remove("bx-moon");
      modeText.textContent = "Mode Lumière";
      menu.textContent = "Mode Lumière";
   
    } else {
      body.classList.add('light');
      icon.classList.add("bx-moon");
      icon.classList.remove("bx-sun");
      modeText.textContent = "Mode Sombre";
      menu.textContent = "Mode Sombre";
    }
   
    // update localStorage when the mode is changed
    icon.addEventListener('click', () => {
      if(body.classList.contains("dark")) {
        body.classList.remove('dark')
        body.classList.add('light');
        icon.classList.remove("bx-sun");
        icon.classList.add("bx-moon");
        modeText.textContent = "Mode Sombre";
        menu.textContent = "Mode Sombre";
        localStorage.setItem(localStorageKey, "light");
      } else {
        body.classList.remove('light')
        body.classList.add('dark');
        icon.classList.add("bx-sun");
        icon.classList.remove("bx-moon");
        modeText.textContent = "Mode Lumière";
        menu.textContent = "Mode Lumière";
        localStorage.setItem(localStorageKey, "dark");
      }
    });*/
  }
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  switchMode() {

   this.themeService.toggleMode();
   console.log(this.themeService.mode);
   if(this.themeService.mode=='light')
   {
    this.modeaff='Mode Sombre';
    this.testclass='bx bx-moon icon';
   }
   else{
    this.modeaff='Mode Lumière';
    this.testclass='bx bx-sun icon';
   }

   
   }
    
    
    get mode() {
    
    return this.themeService.mode;
    
    }

  /**************POUR LA DECONNEXTION**************/

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/home']);
    
  }
  
  reloadData() {
    this.user = this.userServiceGestService.getUser(this.id);}

    help(){

      this.router.navigate(['/info']);
      
      }

      openstat() {
        this.router.navigate(['/stattics'])
      } 
}