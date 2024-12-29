import { useEffect, useState } from "react";
import "./SidePanel.css";

const SidePanel = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/history")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        return response.json();
      })
      .then((data) => {
        setHistory(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }, []);

  return (
    <div className="sidepanel">
      <h2>History</h2>
      <ul className="sidepanel-list">
        {history.map((item, index) => (
          <li key={index} className="sidepanel-item">
            <div>{item?.title}</div>
            <div>{item?.originalname}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SidePanel;
