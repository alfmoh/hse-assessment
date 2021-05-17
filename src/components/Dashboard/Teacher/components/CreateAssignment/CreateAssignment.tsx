import React, { useState } from "react";
import "./CreateAssignment.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useHistory } from "react-router-dom";
import ConceptMap from "shared/components/ConceptMap/ConceptMap";
import { createAssignment } from "shared/services/app/user.service";

const CreateAssignment = () => {
  const history = useHistory();
  const [assignmentText, setAssignmentText] = useState("");
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
