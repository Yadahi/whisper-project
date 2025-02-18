import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useContent } from "../context/ContentContext";

const UploadPage = ({ onRefresh }) => {
  const { contentDispatch } = useContent();
  const navigate = useNavigate();

  //   TODO add loading and error state
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    const selectedFile = e.target.elements.audio.files[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("title", e.target.title.value);
    formData.append("audio", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      //   TODO the data.product is stupid
      const { _id, path, transcriptionData, ...file } = data.product;

      contentDispatch({
        type: "SET_CONTENT",
        payload: {
          file: file,
          audioUrl: `${import.meta.env.VITE_APP_ASSET_URL}/${path}`,
          output: transcriptionData,
        },
      });
      console.log("DATA 1", data);

      onRefresh((prev) => !prev);
      navigate(`/item/${_id}`);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="upload-section">
      <form onSubmit={handleUpload}>
        <input type="file" id="audio-input" name="audio" />
        <input type="text" id="title" name="title" />
        {/* TODO add disabled state for button */}
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default UploadPage;
