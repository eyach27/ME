import { User } from "../GestionUser/user";
import { Department } from "../department/departement";
import { Formation } from "./formation";
import {Document} from "./../GestionDoc/document"

export class FormationPlan {
    id: number;
    formation: Formation;
    startDate: string;
    formateur: User;
    endDate: string;
    description: string;
    typePlan: string;
    jourSemaine: string[];
    participants: User[];
    documents: Document[];
    departements: Department[];
    enLigne: boolean;
    salle: string;
    localisation: string;
    type:String;
    disabled: boolean;
    enabled: any;
    planningType: string;
    
}

  