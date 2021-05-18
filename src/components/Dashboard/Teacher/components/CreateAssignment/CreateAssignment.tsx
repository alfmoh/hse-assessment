import React, { useContext, useEffect, useRef, useState } from "react";
import "./CreateAssignment.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useHistory } from "react-router-dom";
import ConceptMap from "shared/components/ConceptMap/ConceptMap";
import {
  createAssignment,
  getAssignments,
  getUsers,
} from "shared/services/app/user.service";
import { useAuth } from "shared/components/Firebase/auth";
import { AppContext } from "shared/context/app.context";
import { Constants } from "shared/constants";
import { Toast } from "primereact/toast";
import Loader from "shared/Loader/Loader";

const CreateAssignment = () => {
  const history = useHistory();
  const [assignmentText, setAssignmentText] = useState("");
  const [state, dispatch] = useContext(AppContext);
  const auth = useAuth();
  const toast = useRef(null as any);
  const showLoader = (show: boolean) => {
    dispatch({
      type: Constants.SHOW_LOADER,
      payload: show,
    });
  };
  const showToast = (severity: string, summary: string, detail: string) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };
  useEffect(() => {
    // console.clear();
    if (auth.user && auth.user.uid) {
      Promise.all([getUsers(auth.user.uid), getAssignments()]).then((value) => {
        const result = value[0];
        const { data } = result[0];
        console.log(value);
        dispatch({
          type: Constants.SET_MAP_DATA,
          payload: { nodes: data.nodes, links: data.links },
        });
        const assignment = value[1];
        if (assignment && assignment.length) {
          setAssignmentText(assignment[assignment.length - 1].assignmentText);
        }
        // setMapData({ nodes: data.nodes, links: data.links });
      });
    }
  }, [auth.user, dispatch]);
  return (
    <div className="ca">
      <Toast ref={toast} />
      {/* <Loader /> */}
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
        style={{ float: "right", margin: 20 }}
        label="Save"
        onClick={() => {
          showLoader(true);
          createAssignment({ assignmentText }).then(() => {
            showToast("success", "Success", "Assignment created");
            showLoader(false);
          });
        }}
      />
      <Divider />
      <ConceptMap />
      {/* <details>
        <summary className="ca-map__title">Create Map</summary>
        <ConceptMap />
      </details> */}
    </div>
  );
};

export default CreateAssignment;
