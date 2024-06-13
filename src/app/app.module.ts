import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import{ MatCheckboxModule} from "@angular/material/checkbox";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FormsModule } from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { ProfileComponent } from './profile/profile.component';
import { ResetpasswordComponent } from './resetpassword/resetpassword.component';
import { UserListComponent } from './GestionUser/user-list/user-list.component';
import { UserCreateComponent } from './GestionUser/user-create/user-create.component';
import { UserDetailsComponent } from './GestionUser/user-details/user-details.component';
import { UserUpdateComponent } from './GestionUser/user-update/user-update.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';  
import { NgxPaginationModule } from 'ngx-pagination';
import { UserEnattenteComponent } from './GestionUser/user-enattente/user-enattente.component';
import {MatFormFieldModule} from '@angular/material/form-field'; 
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { DocUploadComponent } from './GestionDoc/doc-upload/doc-upload.component';
import { ProgressComponent } from './GestionDoc/progress/progress.component';
import { DndDirective } from './GestionDoc/dnd.directive';
import { NgxDocViewerModule } from 'ngx-doc-viewer';  
import { DocViewComponent } from './GestionDoc/doc-view/doc-view.component';
import { DocFavComponent } from './GestionDoc/doc-fav/doc-fav.component';
import { MatChipsModule } from '@angular/material/chips';
import { FileUploadModule } from 'ng2-file-upload';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {CommonModule} from "@angular/common";
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {DialogModule, Dialog} from 'primeng/dialog';
import { DocByDepComponent } from './GestionDoc/doc-by-dep/doc-by-dep.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DepartmentComponent } from './department/department.component';
import { ThemeService } from './theme.service';
import { PlanFormationComponent } from './GestionForm/plan-formation/plan-formation.component';
import { PlanLotComponent } from './GestionForm/plan-lot/plan-lot.component';
import { FormationsComponent } from './GestionForm/formations/formations.component';
import { CreationFormationComponent } from './GestionForm/creation-formation/creation-formation.component';
import { MesformationsComponent } from './GestionForm/mesformations/mesformations.component';
import { MesdocComponent } from './GestionDoc/mesdoc/mesdoc.component';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule } from '@angular/forms';
import { DetailFormComponent } from './GestionForm/detail-form/detail-form.component';
import { EditFormationComponent } from './GestionForm/edit-formation/edit-formation.component';
import { EditLotComponent } from './GestionForm/edit-lot/edit-lot.component';
import { DetailLotComponent } from './GestionForm/detail-lot/detail-lot.component';
import { InfoComponent } from './info/info.component';
import { AddFormLotComponent } from './GestionForm/add-form-lot/add-form-lot.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { StatticsComponent } from './stattics/stattics.component';
import { NgApexchartsModule } from 'ng-apexcharts';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ForgotpasswordComponent,
    ProfileComponent,
    ResetpasswordComponent,
    UserListComponent,
    UserCreateComponent,
    UserDetailsComponent,
    UserUpdateComponent,
    UserEnattenteComponent,
    DocUploadComponent,
    ProgressComponent,
    DndDirective,
    DocViewComponent,
    DocFavComponent,
    DocByDepComponent,
    DashboardComponent,
    DepartmentComponent,
    PlanFormationComponent,
    PlanLotComponent,
    FormationsComponent,
    CreationFormationComponent,
    MesformationsComponent,
    MesdocComponent,
    DetailFormComponent,
    EditFormationComponent,
    EditLotComponent,
    DetailLotComponent,
    InfoComponent,
    AddFormLotComponent,
    StatticsComponent,
  ],
  imports: [
    CommonModule ,
    MatProgressSpinnerModule,
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    MatTableModule,
    MatInputModule,
    FontAwesomeModule,
    Ng2SearchPipeModule,
    BrowserAnimationsModule,
    MatDialogModule,
    NgxPaginationModule,
    MatFormFieldModule,
    AngularFileUploaderModule,
    NgxDocViewerModule,
    MatChipsModule,
    FileUploadModule,
    AutoCompleteModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    DialogModule,
    PdfViewerModule,
    MatCheckboxModule,
    MatTooltipModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    FullCalendarModule,
    NgApexchartsModule,
  ],
 

  providers: [authInterceptorProviders,ThemeService ,DatePipe ],
  bootstrap: [AppComponent]
})
export class AppModule { }
