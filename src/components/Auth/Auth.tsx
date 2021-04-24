import { useContext, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import "./Auth.scss";
import { useAuth } from "shared/components/Firebase/auth";
import Loader from "shared/Loader/Loader";
import { AppContext } from "shared/context/app.context";
import { Constants } from "shared/constants";

const Auth = () => {
  const [emailVal, setEmail] = useState("");
  const [passwordVal, setPassword] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [username, setUsername] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [regPasswordType, setRegPasswordType] = useState("password");
  const [, dispatch] = useContext(AppContext);
  const toast = useRef(null as any);
  const auth = useAuth();

  const showToast = (severity: string, summary: string, detail: string) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const showLoader = (show: boolean) => {
    dispatch({
      type: Constants.SHOW_LOADER,
      payload: show,
    });
  };

  const isValidEmail = (email: string) => {
    var reg = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    return reg.test(email);
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
                auth
                  .signIn(emailVal, passwordVal)
                  .then(() => {
                    showToast("success", "Success", "Sign in successful");
                  })
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
                auth
                  .registerUser(regEmail, regPassword, username)
                  .then(() =>
                    showToast(
                      "success",
                      "Success",
                      "Account successfully registered"
                    )
                  )
                  .catch((err: { message: string }) => {
                    showToast("error", "Error", err.message);
                  });
              }}
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
