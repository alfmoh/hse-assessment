import React, { useContext } from "react";
import { AppContext, IAppContext } from "shared/context/app.context";
import "./Loader.scss";

const Loader = () => {
  const [state] = useContext(AppContext);
  const { showLoader, loaderText } = state as IAppContext;
  return (
    <div className={`dup-loader ${!showLoader ? "display--none" : ""}`}>
      <div className="dup-loader-loaders">
        <i className="pi pi-spin pi-spinner" style={{ fontSize: "2em" }}></i>
        <p>{loaderText}</p>
      </div>
    </div>
  );
};

export default Loader;
