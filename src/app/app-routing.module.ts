import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import{ResetpasswordComponent} from './resetpassword/resetpassword.component';
import { UserListComponent } from './GestionUser/user-list/user-list.component';
import { UserCreateComponent } from './GestionUser/user-create/user-create.component';
import {UserDetailsComponent} from './GestionUser/user-details/user-details.component';
import { UserUpdateComponent } from './GestionUser/user-update/user-update.component';
import { UserEnattenteComponent } from './GestionUser/user-enattente/user-enattente.component';
import { DocUploadComponent } from './GestionDoc/doc-upload/doc-upload.component';
import { DocViewComponent } from './GestionDoc/doc-view/doc-view.component';
import { DocFavComponent } from './GestionDoc/doc-fav/doc-fav.component';
import { DocByDepComponent } from './GestionDoc/doc-by-dep/doc-by-dep.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Department } from './department/departement';
import { DepartmentComponent } from './department/department.component';
import { PlanFormationComponent } from './GestionForm/plan-formation/plan-formation.component';
import { PlanLotComponent } from './GestionForm/plan-lot/plan-lot.component';
import { FormationsComponent } from './GestionForm/formations/formations.component';
import { CreationFormationComponent } from './GestionForm/creation-formation/creation-formation.component';
import { MesformationsComponent } from './GestionForm/mesformations/mesformations.component';
import { MesdocComponent } from './GestionDoc/mesdoc/mesdoc.component';
import { DetailFormComponent } from './GestionForm/detail-form/detail-form.component';
import { EditFormationComponent } from './GestionForm/edit-formation/edit-formation.component';
import { EditLotComponent } from './GestionForm/edit-lot/edit-lot.component';
import { DetailLotComponent } from './GestionForm/detail-lot/detail-lot.component';
import { InfoComponent } from './info/info.component';
import { AddFormLotComponent } from './GestionForm/add-form-lot/add-form-lot.component';
import { StatticsComponent } from './stattics/stattics.component';
const routes: Routes = [
  {path:'home',component:HomeComponent},
  {path:'forgotpassword',component:ForgotpasswordComponent},
  {path: 'profile', component: ProfileComponent },
  {path:'resetpassword',component:ResetpasswordComponent},
  {path:'user-list',component:UserListComponent},
  {path:'user-create',component:UserCreateComponent},
  {path:'user-details/:id',component:UserDetailsComponent},
  {path:'user-update/:id',component:UserUpdateComponent},
  {path:'user-enattente',component:UserEnattenteComponent},
  {path:'doc-upload',component:DocUploadComponent},
  {path:'doc-view',component:DocViewComponent},
  {path:'doc-fav',component:DocFavComponent},
  {path:'',component:HomeComponent},
  {path:'search/:searchTerm',component:DocViewComponent},
  {path:'doc-bydep',component:DocByDepComponent},
  {path:'dashboard',component:DashboardComponent},
  {path:'departement',component:DepartmentComponent},
  {path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {path : 'plan-formation' ,component:PlanFormationComponent},
  {path:'plan-lot' , component:PlanLotComponent},
  {path:'formations' , component:FormationsComponent} ,
  {path:'creer-formation',component:CreationFormationComponent},
  {path:'mes-formations',component:MesformationsComponent},
  {path:'mes-documents',component:MesdocComponent},
  {path:'detail-form/:id',component:DetailFormComponent},
  {path:'detail-lot/:id',component:DetailLotComponent},
  {path:'edit-formation/:id',component:EditFormationComponent},
  {path:'edit-lot/:id',component:EditLotComponent},
  {path:'info',component:InfoComponent},
  {path:'add-form-lot/:id',component:AddFormLotComponent},
  {path:'stattics', component:StatticsComponent}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
