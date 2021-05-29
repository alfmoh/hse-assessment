import { ICourse } from "./Course";
import { IAssignment } from "./Assignment";
import { IUser } from "./User";
import { IMap } from "./Map";

export interface IStudent extends IUser {
  assignments: IAssignment[];
  courses: ICourse[];
  maps: IMap[];
}
