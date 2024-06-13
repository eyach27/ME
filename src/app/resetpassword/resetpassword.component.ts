import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/user-auth.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.component.html',
  styleUrls: ['./resetpassword.component.scss']
})
export class ResetpasswordComponent implements OnInit {

  form: any = {password: null};
  isSuccessful = true;
  isResetPasswordFailed = false;
  errorMessage = '';
  router:Router;
  token: string;
  constructor(private authService: AuthService,private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams
    .subscribe(params => {
      this.token=params['token'];
      console.log("hi",this.token); 
    });
  }

  onSubmit() {

   const {password} = this.form;
    
  this.authService.resetpassword(this.token, password).subscribe(
    
 data => {
    
 console.log(data);
    
 this.isSuccessful = true;
    
    this.isResetPasswordFailed = false;
    
 this.router.navigate(['/home']);
    
},
    
 err => {
    
   this.errorMessage = err.error.message;
    
   this.isResetPasswordFailed = true;
    
     this.isSuccessful = false;
    
     }
    
    );
    
  }}