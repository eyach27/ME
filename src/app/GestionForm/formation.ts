import { User } from "../GestionUser/user";
import { Department } from "../department/departement";
import { Document } from "../GestionDoc/document";

export class Formation {
     id: number;
     name: string;
     formateur:User;
     documents:Document[];
     departments:Department[];
   }
 