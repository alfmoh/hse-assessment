import React, { useState } from "react";
import "./Teacher.scss";
import { Card } from "primereact/card";
import { TabView, TabPanel } from "primereact/tabview";
import Assignments from "./components/Assignments/Assignments";

const Teacher = () => {
  const [activeTab, setActiveTab] = useState(1);
  return (
    <div className="te">
      <Card className="te-card">
        <TabView
          activeIndex={activeTab}
          onTabChange={(e) => setActiveTab(e.index)}
        >
          <TabPanel leftIcon="pi pi-fw pi-home" header="Home">
            Home
          </TabPanel>
          <TabPanel leftIcon="pi pi-fw pi-calendar" header="Assignments">
            <Assignments />
          </TabPanel>
          {/* <TabPanel leftIcon="pi pi-fw pi-sitemap" header="Maps">
            <Maps />
          </TabPanel> */}
        </TabView>
      </Card>
    </div>
  );
};

export default Teacher;
