import { IUser } from "./IUser";
import { ICurricularUnit } from "./ICurricularUnit";

export interface IMentoringRequest {
  id?: number,
  mentee?: IUser,
  curricularUnit: ICurricularUnit,
  date?: Date,
}
