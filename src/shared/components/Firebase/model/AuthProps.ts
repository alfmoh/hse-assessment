export interface IAuthProps {
  user: AppUser;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
  registerUser: (
    email: string,
    password: string,
    username: string,
    isTeacher: boolean
  ) => Promise<AppUser | null>;
  getDbUser: (userId: string) => Promise<void>;
  getToken: () => Promise<string>;
  passwordReset: (email: string) => Promise<void>;
}

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  assigments?: any[];
  studentWorks?: any[];
  isTeacher: boolean;
}
