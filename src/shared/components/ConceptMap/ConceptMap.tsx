import React, { useState } from "react";
import { Graph } from "react-d3-graph";
import "./ConceptMap.scss";
import { Sidebar } from "primereact/sidebar";

const ConceptMap = () => {
  const [visibleSidebar, setVisibleSidebar] = useState(false);
  const [clickedItem, setClickedItem] = useState(null as any);
  const [data, setData] = useState({
    nodes: [{ id: 1 }, { id: 2 }, { id: 3 }],
    links: [
      { source: 1, target: 2 },
      { source: 2, target: 3 },
    ],
  });

  const config = {
    nodeHighlightBehavior: true,
    node: {
      color: "lightgreen",
      size: 120,
      highlightStrokeColor: "blue",
    },
    link: {
      highlightColor: "lightblue",
    },
    staticGraphWithDragAndDrop: true,
    directed: true,
  };

  const sidebarData = () => {
    if (clickedItem) {
      const { data } = clickedItem;
      if (clickedItem.isNode) {
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
    <div>
      <Sidebar
        position="right"
        visible={visibleSidebar}
        onHide={() => setVisibleSidebar(false)}
      >
        {sidebarData()}
      </Sidebar>
      <Graph
        id="graph-id" // id is mandatory
        data={data}
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
          setData({
            ...data,
            nodes: [...data.nodes, ...node],
            links: [...data.links, ...link],
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
          console.log({ source, target });
        }}
      />
    </div>
  );
};

export default ConceptMap;
