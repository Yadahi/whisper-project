import { useState } from "react";
import { ContentProvider } from "./context/ContentContext";
import { TimeProvider } from "./context/TimeContext";
import SidePanel from "./components/SidePanel";
import MainSection from "./components/MainSection";
import "./App.css";

const App = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <div className="App">
      <TimeProvider>
        <ContentProvider>
          <SidePanel refreshFlag={refreshFlag} />
          <MainSection onRefresh={setRefreshFlag} />
        </ContentProvider>
      </TimeProvider>
    </div>
  );
};

export default App;
