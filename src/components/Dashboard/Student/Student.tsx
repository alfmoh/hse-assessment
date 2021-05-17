import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useContext, useEffect, useState } from "react";
import ConceptMap from "shared/components/ConceptMap/ConceptMap";
import { useAuth } from "shared/components/Firebase/auth";
import { Constants } from "shared/constants";
import { AppContext } from "shared/context/app.context";
import { getAssignments, getUsers } from "shared/services/app/user.service";
import Assignments from "../Teacher/components/Assignments/Assignments";
import "./Student.scss";

const Student = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [teacherAssignment, setTeacherAssignment] = useState("");
  const auth = useAuth();
  const [state, dispatch] = useContext(AppContext);
  useEffect(() => {
    getAssignments()
      .then((assignment) => {
        if (assignment && assignment.length) {
          setTeacherAssignment(
            assignment[assignment.length - 1].assignmentText
          );
        }
      })
      .then(() => {
        if (auth.user && auth.user.uid) {
          getUsers(auth.user.uid).then((result) => {
            const { data } = result[0];
            dispatch({
              type: Constants.SET_MAP_DATA,
              payload: { nodes: data.nodes, links: data.links },
            });
            // setMapData({ nodes: data.nodes, links: data.links });
          });
        }
      });
  }, [auth.user, dispatch]);
  return (
    <div className="te">
      <Card className="te-card">
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
        >
          <TabPanel leftIcon="pi pi-fw pi-home" header="Assignments">
            <p dangerouslySetInnerHTML={{ __html: teacherAssignment }}></p>
          </TabPanel>
          <TabPanel leftIcon="pi pi-fw pi-calendar" header="Maps">
            {/* <Assignments /> */}
            <details>
              <summary className="ca-map__title">Create Map</summary>
              <ConceptMap />
            </details>
          </TabPanel>
          {/* <TabPanel leftIcon="pi pi-fw pi-sitemap" header="Maps">
        <Maps />
      </TabPanel> */}
        </TabView>
      </Card>
    </div>
  );
};

export default Student;
