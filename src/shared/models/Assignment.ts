import { ITeacher } from "./Teacher";

export interface IAssignment {
    id: string;
    title: string;
    content: string;
    creator: ITeacher
}