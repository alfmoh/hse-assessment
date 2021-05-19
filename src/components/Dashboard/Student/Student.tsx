import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Divider } from "primereact/divider";
import { TabView, TabPanel } from "primereact/tabview";
import React, { useContext, useEffect, useState } from "react";
import ConceptMap from "shared/components/ConceptMap/ConceptMap";
import { useAuth } from "shared/components/Firebase/auth";
import { Constants } from "shared/constants";
import { AppContext, IAppContext } from "shared/context/app.context";
import {
  getAllUsers,
  getAssignments,
  getUsers,
  updateUserField,
} from "shared/services/app/user.service";
import { lemmatizer } from "lemmatizer";
import "./Student.scss";
import { bow, dict } from "shared/helpers/bow";
const textsimilarity = require("textsimilarity");
var jaccard = require("jaccard");
var distance = require("euclidean-distance");
var l2norm = require("compute-l2norm");

const Student = () => {
  const [activeTab, setActiveTab] = useState(1);
  const [teacherAssignment, setTeacherAssignment] = useState("");
  const [teacherData, setTeacherData] = useState({} as any);
  const auth = useAuth();
  const [state, dispatch] = useContext(AppContext);
  const { mapData } = state as IAppContext;
  useEffect(() => {
    console.clear();
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
          Promise.all([getUsers(auth.user.uid), getAllUsers()]).then(
            (value) => {
              const result = value[0];
              const { data } = result[0];
              if (data && data.nodes && data.links && data.links.length) {
                dispatch({
                  type: Constants.SET_MAP_DATA,
                  payload: { nodes: data.nodes, links: data.links },
                });
              }
              const teacher = value[1].filter((x) => x.isTeacher)[0];
              setTeacherData(teacher);
              // setMapData({ nodes: data.nodes, links: data.links });
            }
          );
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
          <TabPanel leftIcon="pi pi-fw pi-calendar" header="Home">
            {/* <Assignments /> */}
            {/* <details>
              <summary className="ca-map__title">Create Map</summary>
              <ConceptMap />
            </details> */}
            {/* <ConceptMap /> */}
          </TabPanel>
          <TabPanel leftIcon="pi pi-fw pi-home" header="Assignments">
            <p dangerouslySetInnerHTML={{ __html: teacherAssignment }}></p>
            <Divider />
            <Button
              label="Submit"
              onClick={() => {
                if (mapData && mapData.links && mapData.links.length) {
                  const splitter = (str: string) => {
                    if (!str) return [""];
                    return str.split(/(\s+)/);
                  };
                  const studentSent = mapData.links.map(
                    (x) => `${x.source} ${x.label} ${x.target}`
                  );
                  const teacherSent = teacherData.links.map(
                    (x) => `${x.source} ${x.label} ${x.target}`
                  );
                  const prepareData = (dataToPrepare) => {
                    const sentences: any[] = [];
                    dataToPrepare.links.forEach((x: any) => {
                      splitter(x.source).forEach((y) =>
                        sentences.push(y.trim())
                      );
                      splitter(x.label).forEach((y) =>
                        sentences.push(y.trim())
                      );
                      splitter(x.target).forEach((y) =>
                        sentences.push(y.trim())
                      );
                    });
                    return sentences
                      .filter((x) => x)
                      .filter((x) => x.length > 3);
                  };

                  // jaccard
                  // lemmatize
                  const lemmas1 = prepareData(mapData)
                    .map((sent) => lemmatizer(sent))
                    .filter((x) => x.length > 3);
                  const techPrep = prepareData(teacherData);
                  console.log("teacher prep");
                  console.log(techPrep);
                  const lemmas2 = techPrep
                    .map((sent) => lemmatizer(sent))
                    .filter((x) => x.length > 3);
                  console.log("teacher lemma");
                  console.log(lemmas2);
                  const jaccardVal = jaccard.index(lemmas1, lemmas2);
                  console.log(jaccardVal);

                  // cosine
                  const cosineVal2 = textsimilarity(
                    lemmas1.join(" "),
                    lemmas2.join(" ")
                  );
                  console.log(cosineVal2);

                  // BOW
                  const voc = dict(studentSent);
                  const voc2 = dict(teacherSent);
                  const vec1 = bow(lemmas1.join(" "), voc);
                  const vec2 = bow(lemmas2.join(" "), voc2);
                  console.log("teacher vectors");
                  const normValVec1 = l2norm(vec1);
                  const normValVec2 = l2norm(vec2);
                  const normVecs1 = vec1.map((x) => x / normValVec1);
                  const normVecs2 = vec1.map((x) => x / normValVec2);

                  // Euclidean
                  const euclideanVal = distance(
                    normVecs2.length > normVecs1 ? normVecs1 : normVecs2,
                    normVecs2.length > normVecs1 ? normVecs2 : normVecs1
                  );

                  const assessmentNorm = {
                    cosineVal: cosineVal2,
                    jaccardVal,
                    euclideanVal,
                  };
                  console.log(assessmentNorm);
                  updateUserField(auth.user.uid, {
                    assessment: assessmentNorm,
                  });
                }
              }}
              className="p-button-success"
            />
            <ConceptMap />
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
