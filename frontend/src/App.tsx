import { useState } from "react";
import { ContentProvider } from "./context/ContentContext";
import { TimeProvider } from "./context/TimeContext";
import SidePanel from "./components/SidePanel";
import MainSection from "./components/MainSection";
import "./App.css";
import { Route, Routes } from "react-router";
import NotFoundPage from "./components/NotFoundPage";
import UploadPage from "./components/UploadPage";
import Header from "./components/Header";

const App = () => {
  const [refreshFlag, setRefreshFlag] = useState(false);

  return (
    <div className="App">
      <TimeProvider>
        <ContentProvider>
          {/* TODO add header */}
          <Header />
          <div className="main-content">
            <SidePanel refreshFlag={refreshFlag} />
            <Routes>
              <Route
                path="/"
                element={<UploadPage onRefresh={setRefreshFlag} />}
              />
              {/* TODO create custom edit component */}
              <Route
                path="/item/:id"
                element={<MainSection onRefresh={setRefreshFlag} />}
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </ContentProvider>
      </TimeProvider>
    </div>
  );
};

export default App;
