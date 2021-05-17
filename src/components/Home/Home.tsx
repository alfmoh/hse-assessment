import Auth from "components/Auth/Auth";
import Student from "components/Dashboard/Student/Student";
import Teacher from "components/Dashboard/Teacher/Teacher";
import React from "react";
import { Menubar } from "primereact/menubar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./Home.scss";
import { Button } from "primereact/button";
import { useAuth } from "shared/components/Firebase/auth";

const Home = () => {
  const items = [{ label: "LMS" }, { separator: true }];
  const auth = useAuth();
  return (
    <div className="height-100">
      <Menubar
        model={items}
        end={
          <Button
            label="Logout"
            onClick={() => {
              auth.signOut().then(() => {
                window.location.replace("/auth");
              });
            }}
          />
        }
      />
      <BrowserRouter>
        <Switch>
          <Route path="/auth" component={Auth} />
          <Route path="/teacher/:id" component={Teacher} />
          <Route path="/student/:id" component={Student} />
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Home;
