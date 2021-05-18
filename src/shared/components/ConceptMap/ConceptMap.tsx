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
import { AppContext, IAppContext } from "shared/context/app.context";
import { useAuth } from "../Firebase/auth";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
const ConceptMap = () => {
  const NODE = "Node";
  const EDGE = "Edge";
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [clickedItem, setClickedItem] = useState(null as any);
  const [selectedItem, setSelectedItem] = useState(NODE);
  const [nodeName, setNodeName] = useState("");
  const [fromNode, setFromNode] = useState("");
  const [toNode, setToNode] = useState("");
  const [edgeLabel, setEdgeLabel] = useState("");
  const [state, dispatch] = useContext(AppContext);
  const handle = useFullScreenHandle();
  const { mapData } = state as IAppContext;

  let { id } = useParams() as any;

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
    height: 800,
    width: 1200,
    // staticGraphWithDragAndDrop: true,
    directed: true,
  };

  useEffect(() => {
    if (!mapData.nodes) {
      dispatch({
        type: Constants.SET_MAP_DATA,
        payload: { nodes: [], links: [] },
      });
    }
  }, [dispatch, mapData.nodes]);

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
                console.log(mapData);
                let dataUpdate = null as any;
                if (selectedItem === NODE) {
                  if (nodeName && nodeName.trim()) {
                    const nodes = [
                      ...mapData.nodes,
                      {
                        id: nodeName,
                        x: getRandomInt(),
                        y: getRandomInt(50, 10),
                      },
                    ];
                    dataUpdate = {
                      ...mapData,
                      nodes,
                    };
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
                  updateUserField(id, dataUpdate).then(() => {
                    dispatch({
                      type: Constants.SET_MAP_DATA,
                      payload: dataUpdate,
                    });
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
        onClick={handle.enter}
        className="cm__new-btn"
        label="Fullscreen"
      />
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

      {mapData && mapData.nodes && mapData.nodes.length ? (
        <FullScreen handle={handle}>
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
              dispatch({
                type: Constants.SET_MAP_DATA,
                payload: {
                  ...mapData,
                  nodes: [...mapData.nodes],
                  links: [...mapData.links],
                },
              });
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
          />{" "}
        </FullScreen>
      ) : (
        <div>No graph data</div>
      )}
    </div>
  );
};

function getRandomInt(max = 100, min = 30) {
  return Math.random() * (max - min) + min;
}

export default ConceptMap;
