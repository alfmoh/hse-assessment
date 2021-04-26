import Auth from "components/Auth/Auth";
import Student from "components/Dashboard/Student/Student";
import Teacher from "components/Dashboard/Teacher/Teacher";
import React from "react";
import { Menubar } from "primereact/menubar";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./Home.scss";

const Home = () => {
  const items = [{ label: "LMS" }];
  return (
    <div className="height-100">
      <Menubar model={items} />
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
