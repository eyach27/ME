import { Document } from "../GestionDoc/document";
import { FormationPlan } from "../GestionForm/FormationPlan";
import { Role } from "./Role";
export class User {
    id: number;
    firstname: string;
    lastname: string;
    username:string;
    email: string;
    poste:string;
    actif: Boolean;
    password: String
    doc_favoris:Document[];
    roles : Role[];
  //  role:string[];
    photo:string;
    statut:Boolean;
    formation:FormationPlan[];
    formations:FormationPlan[];
  p: string;
  pic: string;

}
