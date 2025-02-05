import { useEffect, useState } from "react";
import "./SidePanel.css";
import SideItem from "./SideItem";

const SidePanel = ({ refreshFlag }) => {
  const [audioUploads, setAudioUploads] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/all")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch history");
        }
        return response.json();
      })
      .then((data) => {
        if (data) setAudioUploads(data);
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  }, [refreshFlag]);

  const handleProductDelete = (id) => {
    setAudioUploads((prevAudioUploads) => {
      return prevAudioUploads.filter((item) => item._id !== id);
    });
  };

  return (
    <div className="sidepanel">
      <h2>History</h2>
      <ul className="sidepanel-list">
        {audioUploads.map((item) => (
          <SideItem
            key={item._id}
            item={item}
            onDeleteProduct={handleProductDelete}
          />
        ))}
      </ul>
    </div>
  );
};

export default SidePanel;
