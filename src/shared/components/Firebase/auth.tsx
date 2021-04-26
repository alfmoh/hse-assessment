import React, { createContext, useContext, useEffect, useState } from "react";
import { createDbUser, getUsers } from "shared/services/app/user.service";
import firebase from "./firebase";
import { AppUser, IAuthProps } from "./model/AuthProps";

const authContext = createContext(null as any);

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};

export const useAuth = () => {
  return useContext(authContext) as IAuthProps;
};

export const useProvideAuth = () => {
  const auth = firebase.auth();
  const [user, setUser] = useState(null as any);
  const [loading, setLoading] = useState(true);

  const handleUser = (firebaseUser: firebase.User | null) => {
    if (firebaseUser) {
      const user = formatUser(firebaseUser);
      setLoading(false);
      setUser(user);
      return user;
    } else {
      setLoading(false);
      setUser(null);
      return false;
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    username: string,
    isTeacher = false
  ) => {
    try {
      const response = await createUser(email, password);
      const user = response.user;
      if (user) {
        return user
          .updateProfile({
            displayName: username,
          })
          .then(() => {
            handleUser(user);
            return user;
          })
          .then(async () => {
            const formattedUser = formatUser(user, isTeacher);
            try {
              await createDbUser(formattedUser);
              return formattedUser;
            } catch (err) {
              return console.log(err);
            }
          })
          .catch((err) => console.log(err));
      }
      return null;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  async function getDbUser(userId: string) {
    try {
      const response = await getUsers(userId);
      if (response && response.length) {
        setUser(response[0].data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const createUser = (email: string, password: string) =>
    auth.createUserWithEmailAndPassword(email, password);

  const signIn = (email: string, password: string) => {
    console.log({ email, password });
    return auth
      .signInWithEmailAndPassword(email, password)
      .then(async (user: any) => {
        if (user) {
          try {
            await getDbUser(user?.uid);
          } catch (error) {
            console.log(error);
          }
        }
      });
  };

  const signOut = async (clearLocal = true) => {
    if (clearLocal) {
      localStorage.clear();
    }
    await auth.signOut();
    return handleUser(null);
  };

  const passwordReset = (email: string) => auth.sendPasswordResetEmail(email);

  useEffect(() => {
    const sub$ = firebase.auth().onAuthStateChanged((user) => {
      handleUser(user);
      if (user) {
        getDbUser(user.uid);
      }
    });
    return () => sub$();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatUser = (user: firebase.User, isTeacher = false): AppUser => {
    return {
      uid: user.uid,
      email: user.email as string,
      displayName: user.displayName as string,
      isTeacher,
    };
  };

  const getToken = async () => {
    return await firebase.auth().currentUser?.getIdToken(true);
  };

  return {
    user,
    loading,
    signIn,
    signOut,
    registerUser,
    getDbUser,
    getToken,
    passwordReset,
  } as IAuthProps;
};
