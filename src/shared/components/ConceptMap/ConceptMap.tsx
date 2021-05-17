import React, { useContext, useEffect, useState } from "react";
import { Graph } from "react-d3-graph";
import "./ConceptMap.scss";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { updateUserField, getUsers } from "shared/services/app/user.service";
import { useParams } from "react-router-dom";
import { Constants } from "shared/constants";
import { AppContext } from "shared/context/app.context";
import { useAuth } from "../Firebase/auth";

const ConceptMap = () => {
  // const initialData = {
  //   nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
  //   links: [
  //     { source: 1, target: 2, label: "Hello" },
  //     { source: 2, target: 3 },
  //   ],
  // };
  const initialData = {
    nodes: [] as any,
    links: [] as any,
  };
  const NODE = "Node";
  const EDGE = "Edge";
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [clickedItem, setClickedItem] = useState(null as any);
  const [mapData, setMapData] = useState(initialData);
  const [selectedItem, setSelectedItem] = useState(NODE);
  const [nodeName, setNodeName] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");
  const [state, dispatch] = useContext(AppContext);
  
  let { id } = useParams() as any;
  const auth = useAuth();

  const citySelectItems = [
    { label: "New York", value: "New York" },
    { label: "Rome", value: "RM" },
    { label: "London", value: "London" },
    { label: "Istanbul", value: "IST" },
    { label: "Paris", value: "PRS" },
  ];

  const config = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
      renderLabel: true,
    },
    // staticGraphWithDragAndDrop: true,
    directed: true,
  };

  useEffect(() => {
    // console.clear();
    if (auth.user && auth.user.uid) {
      getUsers(auth.user.uid).then((result) => {
        const { data } = result[0];
        console.log(data);
        setMapData({ nodes: data.nodes, links: data.links });
      });
    }
  }, [auth.user]);

  const showLoader = (show: boolean) => {
    dispatch({
      type: Constants.SHOW_LOADER,
      payload: show,
    });
  };

  const sidebarData = () => {
    if (clickedItem) {
      const { data } = clickedItem;
      if (clickedItem.isNew) {
        return (
          <div>
            <h3>Select item to create:</h3>
            <div className="p-field-radiobutton">
              <RadioButton
                inputId="item1"
                name="item"
                value={NODE}
                onChange={(e) => setSelectedItem(e.value)}
                checked={selectedItem === NODE}
              />
              <label htmlFor="item1">&nbsp;{NODE}</label>
            </div>
            <br />
            <div className="p-field-radiobutton">
              <RadioButton
                inputId="item2"
                name="item"
                value={EDGE}
                onChange={(e) => setSelectedItem(e.value)}
                checked={selectedItem === EDGE}
              />
              <label htmlFor="item2">&nbsp;{EDGE}</label>
            </div>
            <br />
            {selectedItem === NODE ? (
              <span className="p-float-label">
                <InputText
                  id="nodename"
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                />
                <label htmlFor="nodename">Node name</label>
              </span>
            ) : (
              <div className="cm-edge">
                <div className="cm-edge-node-select">
                  <Dropdown
                    value={fromNode}
                    options={
                      mapData.nodes.length ? mapData.nodes.map((x) => x.id) : []
                    }
                    onChange={(e) => setFromNode(e.value)}
                    placeholder="Select start node"
                  />
                  <i className="pi pi-arrow-right"></i>
                  <Dropdown
                    value={toNode}
                    options={
                      mapData.nodes.length ? mapData.nodes.map((x) => x.id) : []
                    }
                    onChange={(e) => setToNode(e.value)}
                    placeholder="Select end node"
                  />
                </div>
                <br />
                <span className="p-float-label cm-edge__label">
                  <InputText
                    id="edgeLabel"
                    value={edgeLabel}
                    onChange={(e) => setEdgeLabel(e.target.value)}
                  />
                  <label htmlFor="edgeLabel">Edge label</label>
                </span>
              </div>
            )}
            <br />
            <Button
              label={`Save ${selectedItem}`}
              className="p-button-success cm__save-btn"
              onClick={() => {
                let dataUpdate = null as any;
                if (selectedItem === NODE) {
                  if (nodeName && nodeName.trim()) {
                    const nodes = [
                      ...mapData.nodes,
                      { id: nodeName, x: getRandomInt() },
                    ];
                    dataUpdate = {
                      ...mapData,
                      nodes,
                    };
                    console.log(dataUpdate);
                    // updateUserField(id, newData);
                  }
                } else if (selectedItem === EDGE) {
                  if (
                    fromNode &&
                    fromNode.trim() &&
                    toNode &&
                    toNode.trim() &&
                    edgeLabel &&
                    edgeLabel.trim()
                  ) {
                    const newEdge = {
                      source: fromNode,
                      target: toNode,
                      label: edgeLabel,
                    };
                    const links = [...mapData.links, newEdge];
                    dataUpdate = {
                      ...mapData,
                      links,
                    };
                  }
                }
                if (dataUpdate) {
                  showLoader(true);
                  console.log(dataUpdate);
                  updateUserField(id, dataUpdate).then(() => {
                    showLoader(false);
                  });
                }
              }}
            />
          </div>
        );
      } else if (clickedItem.isNode) {
        return <div>{data.nodeId}</div>;
      } else {
        return (
          <div>
            {data.source} - {data.target}
          </div>
        );
      }
    } else return <div></div>;
  };

  return (
    <div className="cm">
      <Button
        onClick={() => {
          setVisibleSidebar(true);
          setClickedItem({ isNew: true, data: {} });
        }}
        className="cm__new-btn"
        label="New item"
      />
      <Sidebar
        style={{ width: "30em" }}
        position="right"
        visible={visibleSidebar}
        onHide={() => {
          setVisibleSidebar(false);
        }}
      >
        {sidebarData()}
      </Sidebar>
      <Graph
        id="graph-id"
        data={mapData}
        config={config}
        onClickNode={(nodeId: any) => {
          setVisibleSidebar(true);
          setClickedItem({
            isNode: true,
            data: {
              nodeId,
            },
          });
          const node = [{ id: 4 }];
          const link = [{ source: 3, target: 4 }];
          setMapData({
            ...mapData,
            nodes: [...mapData.nodes, ...node],
            links: [...mapData.links, ...link],
          });
          // data.nodes.push({ id: 4 });
          // data.links.push({ source: 1, target: 4 });
        }}
        onClickLink={(source: any, target: any) => {
          setClickedItem({
            isNode: false,
            data: {
              source,
              target,
            },
          });
          setVisibleSidebar(true);
        }}
      />
    </div>
  );
};

function getRandomInt() {
  return Math.random() * (100 - 30) + 30;
}

export default ConceptMap;
