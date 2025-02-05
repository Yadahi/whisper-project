import { useState } from "react";
import { ContentProvider } from "./context/ContentContext";
import { TimeProvider } from "./context/TimeContext";
import SidePanel from "./components/SidePanel";
import MainSection from "./components/MainSection";
import "./App.css";
import { Route, Routes } from "react-router";
import NotFoundPage from "./components/NotFoundPage";

const App = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <div className="App">
      <TimeProvider>
        <ContentProvider>
          <SidePanel refreshFlag={refreshFlag} />
          <Routes>
            <Route
              path="/"
              element={<MainSection onRefresh={setRefreshFlag} />}
            />
            <Route
              path="/item/:id"
              element={<MainSection onRefresh={setRefreshFlag} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ContentProvider>
      </TimeProvider>
    </div>
  );
};

export default App;
