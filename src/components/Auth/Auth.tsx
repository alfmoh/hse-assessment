import React, { useContext, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import "./Auth.scss";
import { useAuth } from "shared/components/Firebase/auth";
import Loader from "shared/Loader/Loader";
import { AppContext, IAppContext } from "shared/context/app.context";
import { Constants } from "shared/constants";
import { Checkbox } from "primereact/checkbox";
import { isValidEmail } from "shared/helpers/Helpers";
import { useHistory } from "react-router-dom";

const Auth = () => {
  const [emailVal, setEmail] = useState("");
  const [passwordVal, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [regPasswordType, setRegPasswordType] = useState("password");
  const [state, dispatch] = useContext(AppContext);
  const { isTeacher } = state as IAppContext;
  const toast = useRef(null as any);
  const auth = useAuth();
  const history = useHistory();

  const showToast = (severity: string, summary: string, detail: string) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const showLoader = (show: boolean) => {
    dispatch({
      type: Constants.SHOW_LOADER,
      payload: show,
    });
  };

  const routeCallback = () => {
    if(auth.user) {
      if (isTeacher) {
        history.push(`teacher/${auth.user.uid}`);
      } else {
        history.push(`student/${auth.user.uid}`);
      }
    }
  };

  return (
    <div className="ko-auth">
      <Toast ref={toast} />
      <Loader />
      <Card className="ko-card">
        <header>
          <h2>Sign in or Register to continue</h2>
        </header>
        <div className="ko-auth-container">
          <div className="ko-login ko-auth__parent">
            <h3 className="ko-auth__header">Sign in</h3>
            <span className="p-float-label">
              <InputText
                type="email"
                id="email"
                value={emailVal}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <label htmlFor="email">Email</label>
            </span>
            <span className="p-float-label">
              <InputText
                type={passwordType}
                id="password"
                value={passwordVal}
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
              <i
                className={`pi ${
                  passwordType === "password" ? "pi-eye-slash" : "pi-eye"
                }`}
                onClick={() =>
                  setPasswordType(
                    passwordType === "password" ? "text" : "password"
                  )
                }
              />
              <label htmlFor="password">Password</label>
            </span>
            <Button
              onClick={() => {
                showLoader(true);
                auth
                  .signIn(emailVal, passwordVal)
                  .then(() => {
                    showLoader(false);
                    showToast("success", "Success", "Sign in successful");
                  })
                  .then(() => routeCallback())
                  .catch((err: { code: any; message: string }) => {
                    showLoader(false);
                    if (
                      err &&
                      (err.code || "")
                        .toLocaleLowerCase()
                        .includes("user-not-found")
                    ) {
                      showToast(
                        "error",
                        "Account not found",
                        "No account found. Please register."
                      );
                    } else if (
                      err &&
                      (err.code || "")
                        .toLocaleLowerCase()
                        .includes("wrong-password")
                    ) {
                      showToast(
                        "error",
                        "Wrong password",
                        "Please try again with the correct password."
                      );
                    } else showToast("error", "Error", err.message);
                  });
                showLoader(true);
              }}
              disabled={!isValidEmail(emailVal) || !passwordVal}
              label="Sign in"
            />
          </div>

          <Divider layout="vertical">
            <b>OR</b>
          </Divider>

          <div className="ko-auth-reg ko-auth__parent">
            <h3>Register</h3>
            <span className="p-float-label">
              <InputText
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
              <label htmlFor="email">Name</label>
            </span>
            <span className="p-float-label">
              <InputText
                type="email"
                id="regEmail"
                value={regEmail}
                onChange={(e) => setRegEmail(e.currentTarget.value)}
              />
              <label htmlFor="regEmail">Email</label>
            </span>
            <span className="p-float-label">
              <InputText
                type={regPasswordType}
                id="regPassword"
                value={regPassword}
                onChange={(e) => setRegPassword(e.currentTarget.value)}
              />
              <i
                className={`pi ${
                  regPasswordType === "password" ? "pi-eye-slash" : "pi-eye"
                }`}
                onClick={() =>
                  setRegPasswordType(
                    regPasswordType === "password" ? "text" : "password"
                  )
                }
              />
              <label htmlFor="regPassword">Password</label>
            </span>
            <Button
              disabled={!isValidEmail(regEmail) || !regPassword || !username}
              label="Register"
              onClick={() => {
                showLoader(true);
                auth
                  .registerUser(regEmail, regPassword, username, isTeacher)
                  .then(() => {
                    showLoader(false);
                    showToast(
                      "success",
                      "Success",
                      "Account successfully registered"
                    );
                  })
                  .then(() => {
                    routeCallback();
                  })
                  .catch((err: { message: string }) => {
                    showLoader(false);
                    showToast("error", "Error", err.message);
                  });
              }}
            />
          </div>
        </div>
        <Divider />
        <div className="p-col-12">
          <Checkbox
            inputId="cb1"
            onChange={(e) => {
              dispatch({
                type: Constants.IS_TEACHER,
                payload: e.checked,
              });
            }}
            checked={isTeacher}
          ></Checkbox>
          <label htmlFor="cb1" className="p-checkbox-label">
            &nbsp; I am a teacher
          </label>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
