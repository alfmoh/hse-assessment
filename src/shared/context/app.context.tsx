import React, { createContext, useReducer } from "react";
import { Constants, loadingText } from "shared/constants";

export interface IAppContext {
  showToaster: any;
  loaderText: string;
  showLoader: boolean;
  isTeacher: boolean;
}

const defaultVal: any = null;
export const AppContext = createContext(defaultVal);

const initialState: IAppContext = {
  showToaster: null,
  loaderText: loadingText,
  showLoader: false,
  isTeacher: false,
};

const reducer = (state: IAppContext, action: any): IAppContext => {
  switch (action.type) {
    case Constants.SHOW_LOADER:
      return {
        ...state,
        showLoader: action.payload,
        loaderText: loadingText,
      };
    case Constants.IS_TEACHER:
      return {
        ...state,
        isTeacher: action.payload,
      };

    default:
      return null as any;
  }
};

export const AppContextProvider = (props) => {
  const [state, dispatch] = useReducer(
    reducer as () => IAppContext,
    initialState
  );

  return (
    <AppContext.Provider value={[state, dispatch]}>
      {props.children}
    </AppContext.Provider>
  );
};
