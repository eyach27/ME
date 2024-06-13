import { Component, HostBinding, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '../GestionUser/user';
import { UserServiceGestService } from '../GestionUser/user-service-gest.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { ThemeService } from '../theme.service';
import { environment } from '../../environments/environment';
const API = `${environment.apiBaseUrl }`;
interface DropdownItem {
  title: string;
  info: string;
  isOpen: boolean;
}
@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})

export class InfoComponent implements OnInit {
  @HostBinding('class') componentClass = 'light';
  isLoggedIn = false;
  mode: string;
  currentUser: any;
  user: User;
  id: any;
  role:String;
  showAdminContent = false;
  showFormateurContent=false;
  showUserContent=false;
  adminItemsPoste: { title: string; info: string; isOpen: any; }[];
  adminItemsUser: { title: string; info: string; isOpen: any; }[];
  adminItemsDoc: { title: string; info: string; isOpen: any; }[];

 
  userItemsdoc: { title: string; info: string; isOpen: boolean; }[];
  userItemsForm: { title: string; info: string; isOpen: boolean; }[];
  
  formateurItemsdoc: { title: string; info: string; isOpen: any; }[];
  formateurItemsForm: { title: string; info: string; isOpen: any; }[];
  adminItemsForm: { title: string; info: string; isOpen: boolean; }[];
  adminItemsProfil: { title: string; info: string; isOpen: boolean; }[];
  userItemsProfil: { title: string; info: string; isOpen: boolean; }[];
  formateurItemsProfil: { title: string; info: string; isOpen: boolean; }[];

  constructor( private tokenStorageService : TokenStorageService, private themeService: ThemeService , private token: TokenStorageService, 
    private router: Router,private userServiceGestService: UserServiceGestService) {  
    this.themeService.observeMode().subscribe(mode => {
      this.componentClass = mode;});}

      ngOnInit() {
        if (this.token.getToken()) {
          this.isLoggedIn = true;
          }
        this.currentUser = this.token.getUser();
        this.reloadData();
       
       this.user = new User();
        this.id=this.token.getId()
       this.userServiceGestService.getUser(this.id)
          .subscribe(data => {
            this.user = data;
            for(let i=0;i<this.user.roles.length;i++){
              this.role=this.user.roles[i].name;
            }
            if (this.role=="ROLE_ADMIN"){
              this.showAdminContent=true;

              this.adminItemsProfil = [ 
              { title: "Modifier l'image de mon profil", info: "Allez vers votre profil, cliquez sur l'icône de modification , et importez une nouvelle image" , isOpen:false},
              { title: "Supprimer l'image de mon profil", info: "Pour supprimer votre image de profil, accédez à la section 'Gestion des postes', puis cliquez sur l'icône de suppression. Cela entraînera la suppression de votre photo et l'affichage d'une photo par défaut à la place." , isOpen:false},
              { title: 'Modifier mes coordonnées', info: "Allez vers votre profil, cliquez sur le boutton 'Modifier', veuillez noter que vous pouvez seulement modifier votre nom , prénom et votre poste" , isOpen:false},
            ]

              this.adminItemsPoste = [ /*REMARQUE ajouter un superadmin (activer et désactiver)*/
                { title: 'Ajouter un poste', info: "Allez vers Gestion des postes , cliquez sur l'icône plus 'Ajouter un poste' , écrivez le nom du nouveau poste" , isOpen:false},
                { title: 'Modifier un poste', info: "Allez vers Gestion des postes , cliquez sur l'icône de modification , écrivez le nouveau nom du poste" , isOpen:false},
                { title: 'Supprimer un poste', info: "Allez vers Gestion des postes , cliquez sur l'icône de suppréssion , valider la suppression" , isOpen:false},]
                this.adminItemsUser = [
                  
                { title: 'Ajouter un utilisateur', info: "Allez vers Gestion des utilisateurs , cliquez sur 'Nouveau compte utilisateur' , Remplissez le formulaire et validez-le", isOpen:false},
                { title: "Consulter compte d'un utilisateur", info: "Allez vers Gestion des utilisateurs , cliquez sur  l'icône de visualisation pour consulter le compte d'un utilisateur", isOpen:false},
                { title: 'Activer utilisateur', info: "Allez vers Gestion des utilisateurs , cliquez sur  l'icône d'activation, pour activer un utilisateur", isOpen:false},
                { title: 'Désactiver un utilisateur', info: "Allez vers Gestion des utilisateurs , cliquez sur l'icône de désactivation pour désactiver un utilisateur", isOpen:false},
                { title: 'Modifier un utilisateur', info: "Allez vers  Gestion des utilisateurs ,  cliquez sur l'icône de modification. Vous aurez la possibilité de modifier le poste ou le rôle de l'utilisateur.", isOpen:false},
                { title: 'Accepter un utilisateur', info: "Allez vers  Gestion des utilisateurs , cliquez sur l'icône d'acceptation pour accepter un utilisateur", isOpen:false},
                { title: 'Accepter tous les utilisateurs', info: "Allez vers la section 'Gestion des utilisateurs', puis cliquez sur le bouton 'Accepter tous' pour accepter tous les utilisateurs" , isOpen:false},
                { title: 'Refuser un utilisateur', info: "Allez vers  Gestion des utilisateurs , cliquez sur l'icône de refus pour rejeter la demande d'inscription d'un utilisateur " , isOpen:false},

                ]
                this.adminItemsDoc =[
                  
                    { title: 'Ajouter un document', info: "Allez vers Gestion des documents ,choisissez 'Nouveau document', cliquez sur le bouton 'Ajouter' veuillez noter que en tant admin vous devez obligatoirement choisir les postes et mettre les tags( Remarque :tapper un nom du tag puis appuyez sur la touche 'Entrée') à ce document", isOpen:false},
                    { title: ' Consulter tous les documents ', info: "Allez vers Gestion des documents ,  choisissez 'Tous les documents' , vous pouvez les visualiser soit en mode tableau ou en mode icône", isOpen:false},
                    { title: 'Consulterr les documents de votre poste', info: "Allez vers  Gestion des documents , choisissez 'Documents de mon poste' , vous pouvez les visualiser soit en mode tableau en mode icône" , isOpen:false},
                    { title: 'Consulter les documents en favoris', info: "Allez vers  Gestion des documents ,  choisissez 'Documents en favoris'  , vous pouvez les visualiser soit en mode tableau en mode icône" , isOpen:false},
                    { title: 'Consulter vos documents ', info: "Allez vers  Gestion des documents ,  choisissez 'Mes documents', vous pouvez les visualiser soit en mode tableau en mode icône", isOpen:false},
                    { title: 'Télécharger un document', info: "Allez vers  Gestion des documents ,  choisissez un document et cliquez sur le bouton de telechargement", isOpen:false},
                    { title: 'Ouvrir un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de document  ' , isOpen:false},
                    { title: 'Modifier un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de modification , veuillez noter que seulement admin et le propriétére du document ont le droits de faire la modification' , isOpen:false},
                    { title: 'Supprimer un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de suppression , veuillez noter que seulement admin et le propriétére du document ont le droits de faire la suppression  ' , isOpen:false},
                   

                ]
                this.adminItemsForm =[
                  
                  { title: 'Créer une formation', info: "Allez vers Gestion des formations , choisissez 'Nouvelle formation', Remplissez le formulaire et validez-le", isOpen:false},
                  { title: 'Planifier une formation', info: "Allez vers Gestion des formations , choisissez 'Planifier une formation', Remplissez le formulaire et validez-le", isOpen:false},
                  { title: 'Planifier un lot ', info: "Allez vers Gestion des formations , choisissez 'Planifier un lot', Remplissez le formulaire et validez-le", isOpen:false},
                  { title: 'Consulter toutes les formations crées ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' , cliquez sur l'icône de formation crée, afin de voir toutes les formations crées", isOpen:false},
                  { title: 'Consulter toutes les formations planifiées ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' , cliquez sur l'icône de formation planifiée afin de voir toutes les formations planifiées", isOpen:false},
                  { title: 'Consulter toutes les lots planifiés ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations', cliquez sur l'icône de lot planifié afin de voir toutes les lots planifiés", isOpen:false},
                  { title: 'Consulter toutes les formations en fonctions des utilisateurs ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
                  { title: 'Consulter mes formations', info: "Allez vers Gestion des formations , choisissez 'Mes formations', cliquez soit sur l'icône 'fléche vers le haut' pour consulter les formations a dispensées soit sur l'icône 'fléche vers le bas' pour consulter les formations suivies", isOpen:false},
                  { title: 'Modifier une formation ou un lot', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
                  { title: 'Supprimer une formation ou un lot ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
                  { title: 'Consulter les documents ajoutés a une formation ou un lot ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
                  { title: 'Consulter les participants ajoutés à une formation ou un lot ', info: "Allez vers Gestion des formations , choisir une formation ou un lot ,cliquez sur l'icône de participant  pour consulter tous les participants ajoutés ", isOpen:false},
                 
              ]

                }
            else this.showAdminContent=false;    
        if (this.role=="ROLE_USER"){
          this.showUserContent=true;
           
          this.userItemsProfil = [ 
            { title: "Modifier l'image de mon profil", info: "Allez vers votre profil, cliquez sur l'icône de modification , et importez une nouvelle image" , isOpen:false},
            { title: "Supprimer l'image de mon profil", info: "Pour supprimer votre image de profil, accédez à la section 'Gestion des postes', puis cliquez sur l'icône de suppression. Cela entraînera la suppression de votre photo et l'affichage d'une photo par défaut à la place." , isOpen:false},
            { title: 'Modifier mes coordonnées', info: "Allez vers votre profil, cliquez sur le boutton 'Modifier', veuillez noter que vous pouvez seulement modifier votre nom et prénom" , isOpen:false},
          ]
          this.userItemsdoc = [
            { title: 'Ajouter un document', info: "Allez vers Gestion des documents ,choisissez 'Nouveau document', cliquez sur le bouton 'Ajouter', veuillez noter que vous devez ajouter des tags( Remarque :tapper un nom du tag puis appuyez sur la touche 'Entrée')à ce document", isOpen:false},
            { title: ' Consulter tous les documents ', info: "Allez vers Gestion des documents ,  choisissez 'Tous les documents' , vous pouvez les visualiser soit en mode tableau ou en mode icône", isOpen:false},
            { title: 'Consulterr les documents de votre poste', info: "Allez vers  Gestion des documents , choisissez 'Documents de mon poste' , vous pouvez les visualiser soit en mode tableau en mode icône" , isOpen:false},
            { title: 'Consulter les documents en favoris', info: "Allez vers  Gestion des documents ,  choisissez 'Documents en favoris'  , vous pouvez les visualiser soit en mode tableau en mode icône" , isOpen:false},
            { title: 'Consulter vos documents ', info: "Allez vers  Gestion des documents ,  choisissez 'Mes documents', vous pouvez les visualiser soit en mode tableau en mode icône", isOpen:false},
            { title: 'Télécharger un document', info: "Allez vers  Gestion des documents ,  choisissez un document et cliquez sur le bouton de telechargement", isOpen:false},
            { title: 'Ouvrir un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de document  ' , isOpen:false},
            { title: 'Modifier un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de modification , veuillez noter que seulement admin et le propriétére du document ont le droits de faire la modification' , isOpen:false},
            { title: 'Supprimer un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de suppression , veuillez noter que seulement admin et le propriétére du document ont le droits de faire la suppression  ' , isOpen:false},
                   
          ]
          this.userItemsForm = [
            { title: 'Consulter mes formations', info: "Allez vers Gestion des formations , choisissez 'Mes formations', cliquez soit sur l'icône 'fléche vers le haut' pour consulter les formations a dispensées soit sur l'icône 'fléche vers le bas' pour consulter les formations suivies", isOpen:false},
          ]

        }
        else this.showUserContent=false;
        if (this.role=="ROLE_FORMATEUR" )
    
     {
    
     this.showFormateurContent=true;
     this.formateurItemsProfil = [ 
      { title: "Modifier l'image de mon profil", info: "Allez vers votre profil, cliquez sur l'icône de modification , et importez une nouvelle image" , isOpen:false},
      { title: "Supprimer l'image de mon profil", info: "Pour supprimer votre image de profil, accédez à la section 'Gestion des postes', puis cliquez sur l'icône de suppression. Cela entraînera la suppression de votre photo et l'affichage d'une photo par défaut à la place." , isOpen:false},
      { title: 'Modifier mes coordonnées', info: "Allez vers votre profil, cliquez sur le boutton 'Modifier', veuillez noter que vous pouvez seulement modifier votre nom et prénom" , isOpen:false},
    ]

     this.formateurItemsdoc = [
      { title: 'Ajouter un document', info: "Allez vers Gestion des documents ,choisissez 'Nouveau document', cliquez sur le bouton 'Ajouter', veuillez noter que vous devez ajouter des tags( Remarque :tapper un nom du tag puis appuyez sur la touche 'Entrée')à ce document", isOpen:false},
      { title: ' Consulter tous les documents ', info: "Allez vers Gestion des documents ,  choisissez 'Tous les documents' , vous pouvez les visualiser soit en mode tableau ou en mode icône", isOpen:false},
      { title: 'Consulterr les documents de votre poste', info: "Allez vers  Gestion des documents , choisissez 'Documents de mon poste' , vous pouvez les visualiser soit en mode tableau en mode icône" , isOpen:false},
      { title: 'Consulter les documents en favoris', info: "Allez vers  Gestion des documents ,  choisissez 'Documents en favoris'  , vous pouvez les visualiser soit en mode tableau en mode icône" , isOpen:false},
      { title: 'Consulter vos documents ', info: "Allez vers  Gestion des documents ,  choisissez 'Mes documents', vous pouvez les visualiser soit en mode tableau en mode icône", isOpen:false},
      { title: 'Télécharger un document', info: "Allez vers  Gestion des documents ,  choisissez un document et cliquez sur le bouton de telechargement", isOpen:false},
      { title: 'Ouvrir un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de document  ' , isOpen:false},
      { title: 'Modifier un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de modification , veuillez noter que seulement admin et le propriétére du document ont le droits de faire la modification' , isOpen:false},
      { title: 'Supprimer un document', info: 'Allez vers  Gestion des documents , choisissez un document et cliquez sur icone de suppression , veuillez noter que seulement admin et le propriétére du document ont le droits de faire la suppression  ' , isOpen:false},
    ]

    this.formateurItemsForm =[
                  
      { title: 'Créer une formation', info: "Allez vers Gestion des formations , choisissez 'Nouvelle formation', Remplissez le formulaire et validez-le", isOpen:false},
      { title: 'Planifier une formation', info: "Allez vers Gestion des formations , choisissez 'Planifier une formation', Remplissez le formulaire et validez-le", isOpen:false},
      { title: 'Planifier un lot ', info: "Allez vers Gestion des formations , choisissez 'Planifier un lot', Remplissez le formulaire et validez-le", isOpen:false},
      { title: 'Consulter toutes les formations crées ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' , cliquez sur l'icône de formation crée, afin de voir toutes les formations crées", isOpen:false},
      { title: 'Consulter toutes les formations planifiées ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' , cliquez sur l'icône de formation planifiée afin de voir toutes les formations planifiées", isOpen:false},
      { title: 'Consulter toutes les lots planifiés ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations', cliquez sur l'icône de lot planifié afin de voir toutes les lots planifiés", isOpen:false},
      { title: 'Consulter toutes les formations en fonctions des utilisateurs ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
      { title: 'Consulter mes formations', info: "Allez vers Gestion des formations , choisissez 'Mes formations', cliquez soit sur l'icône 'fléche vers le haut' pour consulter les formations a dispensées soit sur l'icône 'fléche vers le bas' pour consulter les formations suivies", isOpen:false},
      { title: 'Modifier une formation ou un lot', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
      { title: 'Supprimer une formation ou un lot ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
      { title: 'Consulter les documents ajoutés a une formation ou un lot ', info: "Allez vers Gestion des formations , choisissez 'Toutes les formations' ,  cliquez sur l'icône de participant pour les formations de chaque participant", isOpen:false},
      { title: 'Consulter les participants ajoutés à une formation ou un lot ', info: "Allez vers Gestion des formations , choisir une formation ou un lot ,cliquez sur l'icône de participant  pour consulter tous les participants ajoutés ", isOpen:false},
     
  ]
    
     }
    } )   
      }
    
      reloadData() {
        this.router.navigate['/info'];
      }      
      toggleDropdown(item: DropdownItem) {
        item.isOpen = !item.isOpen;
      }
    }
      

