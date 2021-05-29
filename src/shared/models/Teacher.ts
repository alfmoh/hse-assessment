import { IMap } from './Map';
import { IStudent } from './Student';
import { IUser } from "./User";

export interface ITeacher extends IUser {
    students: IStudent[]
    maps: IMap[]
}