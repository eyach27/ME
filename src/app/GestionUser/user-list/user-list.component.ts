import { Component, EventEmitter,HostBinding,OnInit, Output } from '@angular/core';  
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserDetailsComponent } from './../user-details/user-details.component';
import { Observable } from "rxjs";
import { UserServiceGestService } from '../user-service-gest.service';
import { User } from "./../user";
import { Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

import {MatTableDataSource} from '@angular/material/table';

import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ThemeService } from '../../theme.service';
import { environment } from 'src/environments/environment';
const API = `${environment.apiBaseUrl }`;
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';

  ///LES VARIABLE DE FILTRAGE //
  userss: any[] = [];
  filteredUsers: any;
  filterType: string = "firstname";
  searchText:string ='';

  /////


  showFilters:boolean=false;
  closeResult: string;  
  users: Observable<User[]>;
  filteredUserss:  Observable<User[]>;
  p: number = 1;
  count: number = 7;
  isLoggedIn=false;
  user :User;
  isUserDisabled = false;
  mode: string;

  ngZone: any;
  message: string;
  test: boolean=false;
  failed=false;
  errorMessage: string;
  formSearch= {
    filtre: 'firstname',
    rech: ''
  };
  constructor(private userServiceGestService: UserServiceGestService, private tokenStorageService : TokenStorageService,
    private router: Router,private modalService: NgbModal ,private themeService: ThemeService ) { 
  
      this.themeService.observeMode().subscribe(mode => {
       
      this.componentClass = mode;
       
       });}


  ngOnInit() {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      }
    this.reloadData();
    this.updateFilteredUsers();
  }
   
  reloadData() {
    this.users = this.userServiceGestService.getUserList().pipe(
      map(users => {
        return users.map(user => {
          user.p = '../../assets/images/photoParDefaut.jpg';
          if (user.photo) {
            const fileName = user.photo.substring(user.photo.lastIndexOf('/') + 1);
            user.p = API + 'api/gestion/PDP/' + fileName;
          }
          return user;
        }).sort((a, b) => a.firstname.localeCompare(b.firstname));
      })
    );
  
    this.users = this.users.pipe(
      map(users => {
        return users.sort((a, b) => {
          if (a.statut && !b.statut) { // sort active users before inactive users
            return -1;
          } else if (!a.statut && b.statut) { // sort inactive users after active users
            return 1;
          } else { // if both users have the same status, sort by username
            return a.username.localeCompare(b.username);
          }
        });
      })
    );
  }
  
 
  



  open(content, id) {  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.StatusUser(id);  
        
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }  

  open2(content2, id) {  
    this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.activateUser(id)
        
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



  activateUser(id: number) {
    this.userServiceGestService.activateUser(id).subscribe(() => {
        this.reloadData();
        this.test=true;
        this.message=('Utilisateur Activé avec succéss');
        setTimeout(() => {
         this.test=false;
            }, 1500);

    });

}



StatusUser(id: number) {  
  this.userServiceGestService.desactivateUser(id).subscribe(() => {
      this.reloadData();
      this.test=true;
      this.message=('Utilisateur désactivé avec succéss');
      setTimeout(() => {
       this.test=false;
          }, 1500);
  });  
}
isDisabled(user) {
  return !user.statut;
}

  userDetails(id: number){ this.router.navigate(['user-details', id]);}

  updateUser(id: number){this.router.navigate(['user-update', id]);}




  updateFilteredUsers() {
    if (!this.searchText) {
      // if no search query entered, show all users
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.pipe(
        map(users => {
          return users.filter(user => {
            // check if the search query matches any user field
            let hasMatch = false;
            if (user.firstname.toLowerCase().includes(this.searchText.toLowerCase()) ||
                   user.poste.toLowerCase().includes(this.searchText.toLowerCase())) {
                hasMatch = true;
            }
            user.roles.forEach(role => {
                if (role.name.toLowerCase().includes(this.searchText.toLowerCase())) {
                    hasMatch = true;
                }
            });
            return hasMatch;
          });
        })
      );
    }
}

Todetails(id)
{
  this.router.navigate(['user-details',id]);
}
}
  


