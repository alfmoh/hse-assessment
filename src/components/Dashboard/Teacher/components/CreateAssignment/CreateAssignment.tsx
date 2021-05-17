import React, { useContext, useEffect, useState } from "react";
import "./CreateAssignment.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useHistory } from "react-router-dom";
import ConceptMap from "shared/components/ConceptMap/ConceptMap";
import { createAssignment, getUsers } from "shared/services/app/user.service";
import { useAuth } from "shared/components/Firebase/auth";
import { AppContext } from "shared/context/app.context";
import { Constants } from "shared/constants";

const CreateAssignment = () => {
  const history = useHistory();
  const [assignmentText, setAssignmentText] = useState("");
  const [state, dispatch] = useContext(AppContext);
  const auth = useAuth();
  useEffect(() => {
    // console.clear();
    if (auth.user && auth.user.uid) {
      getUsers(auth.user.uid).then((result) => {
        const { data } = result[0];
        console.log(data);
        dispatch({
          type: Constants.SET_MAP_DATA,
          payload: { nodes: data.nodes, links: data.links }
        })
        // setMapData({ nodes: data.nodes, links: data.links });
      });
    }
  }, [auth.user, dispatch]);
  return (
    <div className="ca">
      <Button
        label="Go back"
        className="p-button-text"
        icon="pi pi-arrow-left"
        onClick={() => {
          history.goBack();
        }}
      />
      <Divider />
      <ReactQuill
        theme="snow"
        value={assignmentText}
        onChange={setAssignmentText}
      />
      <Button
        style={{float: 'right', margin: 20}}
        label="Save"
        onClick={() => {
          createAssignment({assignmentText});
        }}
      />
      <Divider />
      <details>
        <summary className="ca-map__title">Create Map</summary>
        <ConceptMap />
      </details>
    </div>
  );
};

export default CreateAssignment;
