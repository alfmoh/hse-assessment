import {
  updateDb,
  createDb,
  getDocs,
  updateDocField,
} from "shared/components/Firebase/db";
import { AppUser } from "shared/components/Firebase/model/AuthProps";

const USER_DOC_PATH = "users";

const updateDbUser = (user: AppUser) => {
  return updateDb(USER_DOC_PATH, user.uid, user);
};

const createDbUser = (user: AppUser) => {
  user.templates = [];
  return createDb(USER_DOC_PATH, user.uid, user);
};


const getUsers = (userId: string | string[]) => {
  return getDocs(USER_DOC_PATH, userId);
};

const updateUserField = (user: AppUser, data: any) => {
  return updateDocField(USER_DOC_PATH, user.uid, data);
};

export {
  updateDbUser,
  createDbUser,
  getUsers,
  updateUserField
};
