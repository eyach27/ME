import { Component, OnInit,Input, HostBinding } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserServiceGestService } from '../user-service-gest.service';
import { User } from "./../user";
import { UserListComponent } from '../user-list/user-list.component';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { ThemeService } from '../../theme.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';

  id: number;
  user: any;
role:string;
isLoggedIn=false;
mode: string;

  constructor(private route: ActivatedRoute,private router: Router,private tokenStorageService : TokenStorageService,
    private userServiceGestService: UserServiceGestService, private themeService: ThemeService ) { 
  
      this.themeService.observeMode().subscribe(mode => {
       
      this.componentClass = mode;
       
       });}

  ngOnInit() {
    if (this.tokenStorageService.getToken()) {
      this.isLoggedIn = true;
      }
    this.user = new User();

    this.id = this.route.snapshot.params['id'];
    
    this.userServiceGestService.getUser(this.id)
      .subscribe(data => {
        this.user = data;
        console.log(this.user)

        for(let i=0;i<this.user.roles.length;i++){
          this.role=this.user.roles[i].name;
        }
      }, error => console.log(error));
  }

  list(){
    this.router.navigate(['/user-list']);
  }
}
