import { Button } from "primereact/button";
import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import CreateAssignment from "../CreateAssignment/CreateAssignment";
import "./Assignments.scss";

const Assignments = () => {
  let { path, url } = useRouteMatch();
  return (
    <div className="as">
      <Switch>
        <Route exact path={path}>
          <div>
            <Link to={`${url}/new`}>
              <Button className="as-new" label="New Assignment" />
            </Link>
            <h3>Assignment list</h3>
            <h3>Map list</h3>
          </div>
        </Route>
        <Route path={`${path}/new`}>
          <CreateAssignment />
        </Route>
      </Switch>
    </div>
  );
};

export default Assignments;
