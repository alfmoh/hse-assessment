import {
  updateDb,
  createDb,
  getDocs,
  updateDocField,
  createDbAutoId,
  getAllDocs,
} from "shared/components/Firebase/db";
import { AppUser } from "shared/components/Firebase/model/AuthProps";

const USER_DOC_PATH = "users";

const updateDbUser = (user: AppUser) => {
  return updateDb(USER_DOC_PATH, user.uid, user);
};

const createDbUser = (user: AppUser) => {
  if (user.isTeacher) user.studentWorks = [];
  else user.assigments = [];
  return createDb(USER_DOC_PATH, user.uid, user);
};

const getUsers = (userId: string | string[]) => {
  return getDocs(USER_DOC_PATH, userId);
};

const updateUserField = (userId: string, data: any) => {
  return updateDocField(USER_DOC_PATH, userId, data);
};

const ASSIGNMENTS = "assignments";
const createAssignment = (data: any) => {
  return createDbAutoId(ASSIGNMENTS, data);
};

const getAssignments = () => {
  return getAllDocs(ASSIGNMENTS);
};

const getAllUsers = () => {
  return getAllDocs(USER_DOC_PATH);
}

export {
  updateDbUser,
  createDbUser,
  getUsers,
  updateUserField,
  createAssignment,
  getAssignments,
  getAllUsers
};
