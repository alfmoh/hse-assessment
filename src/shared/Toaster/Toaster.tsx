import { Toast } from "primereact/toast";
import React, { useCallback, useContext, useEffect, useRef } from "react";
import { Constants } from "shared/constants";
import { AppContext, IAppContext } from "shared/context/app.context";

const Toaster = () => {
  const [state, dispatch] = useContext(AppContext);
  const { showToaster } = state as IAppContext;
  const toast: any = useRef(null);
  const toaster = useCallback(
    ({
      severity,
      summary,
      detail,
      duration = 5000,
    }: {
      severity: string;
      summary: string;
      detail: string;
      duration: number;
    }) => {
      toast.current.show({ severity, summary, detail, life: duration });
      return dispatch({
        type: Constants.SHOW_TOASTER,
        payload: null,
      });
    },
    [dispatch]
  );
  useEffect(() => {
    if (showToaster) {
      toaster(showToaster);
    }
  }, [showToaster, toaster]);

  return <Toast ref={toast} />;
};

export default Toaster;
