import { User } from "../GestionUser/user";
import { Department } from "../department/departement";
import { FormationPlan } from "./FormationPlan";

export class Lot {
    id: number;
    name: string;
    formationsPlan:FormationPlan[];
    participants:User[];
    departments:Department[];
    startDate:Date;
    endDate:Date;
    type: string;
  
  }