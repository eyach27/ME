import { Component, EventEmitter, HostBinding, OnInit, Output } from '@angular/core';  
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from "rxjs";
import { UserServiceGestService } from '../user-service-gest.service';
import { User } from "./../user";
import { Router } from '@angular/router';
import { UserDetailsComponent } from './../user-details/user-details.component';
import { filter } from 'rxjs/operators';
import { ThemeService } from '../../theme.service';

import {MatTableDataSource} from '@angular/material/table';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-user-enattente',
  templateUrl: './user-enattente.component.html',
  styleUrls: ['./user-enattente.component.scss']
})
export class UserEnattenteComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';

    ///LES VARIABLE DE FILTRAGE //
    userss: any[] = [];
    filteredUsers: any;
    filterType: string = "firstname";
    searchText:string ='';
  
    /////
  closeResult: string;  
  users: Observable<User[]>;
  p: number = 1;
  count: number = 5;
  isLoggedIn=false;
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
    this.reloadData();}

  reloadData() {
    this.users = this.userServiceGestService.getUserListEnattente();}

  open(content, id) {  
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.deleteUser(id);  
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }  

  opene(contente, id) {  
    this.modalService.open(contente, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.acceptUser(id);  
      }  
    }, (reason) => {  
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;  
    });  
  }  

  openee(contente) {  
    this.modalService.open(contente, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {  
      this.closeResult = `Closed with: ${result}`;  
      if (result === 'yes') {  
        this.acceptAllUsers();  
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

  deleteUser(id: number) {
    this.userServiceGestService.deleteUser(id)
      .subscribe(
        data => {
         
          this.reloadData();
          this.test=true;
          this.message=('Utilisateur réfusé');
          setTimeout(() => {
           this.test=false;
              }, 1500);
        },
        error => {console.log(error);
        this.failed=true;
        this.errorMessage=("Echec : Refus de l''utilisateur est échouée");
        setTimeout(() => {
          this.failed = false;
            }, 1500);
          })
    
  }

  acceptUser(id: number) {
    this.userServiceGestService.acceptUser(id)
      .subscribe(
        data => {
          this.reloadData();
          this.test=true;
          this.message=('Utilisateur accepter avec succés');
          setTimeout(() => {
           this.test=false;
              }, 1500);
        },
        error => {console.log(error);
        this.failed=true;
        this.errorMessage=("Echec : Acceptation de l''utilisateur est échouée");
        setTimeout(() => {
          this.failed = false;
            }, 1500);
          })
    

  }

  acceptAllUsers() {
    this.userServiceGestService.acceptAllUsers()
      .subscribe(
        data => {
          this.reloadData();
          this.test=true;
          this.message=('Utilisateurs accepter avec succés');
          setTimeout(() => {
           this.test=false;
              }, 1500);
        },
        error => {console.log(error);
        this.failed=true;
        this.errorMessage=("Echec : Acceptation des utilisateurs est échouée");
        setTimeout(() => {
          this.failed = false;
            }, 1500);
          })
  }


  /*filter*/
  updateFilterType(event: any) {
    const filterType = (event.target as HTMLSelectElement).value;
    this.filterType = filterType;
  }



  
  updateFilteredUsers()
  { 

    this.userServiceGestService.getUserList().subscribe((data: any) => {
      this.userss = Array.from(data);

     
    })
    
    if(this.searchText=='')
    { 
      this.filteredUsers = this.userss;
      
    }
     if (this.filterType === 'firstname') {
      this.filteredUsers = this.userss.filter((user: any) => user.username.toLowerCase() === this.searchText.toLowerCase());
    }

    if (this.filterType === 'poste') {
      this.filteredUsers = this.userss.filter((user: any) => user.poste.toLowerCase() === this.searchText.toLowerCase());
    }

  }


  
}
