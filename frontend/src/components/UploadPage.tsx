import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useContent } from "../context/ContentContext";
import openSocket from "socket.io-client";
import Lines from "./Lines";

const UploadPage = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const navigate = useNavigate();

  const { state, contentDispatch } = useContent();
  const { output } = state;

  // TODO not necessary anymore because new component. it will add lines when loading
  //   useEffect(() => {
  //     const socket = openSocket("http://localhost:3000");
  //     socket.on("transcription", (data) => {
  //       const line = data.parsedLine;

  //       contentDispatch({
  //         type: "ADD_LINE",
  //         payload: line,
  //       });
  //     });

  //     return () => socket.disconnect();
  //   }, []);

  //   TODO add loading and error state
  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

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
          id: _id,
        },
      });

      setLoading(false);
      onRefresh((prev) => !prev);
      navigate(`/item/${_id}`);
    } catch (error) {
      console.error("Error uploading file:", error);
      setError(error.message);
    }
  };

  const handleUploadFile = (e: ChangeEvent) => {
    console.log(e);
    setIsDisabled(!e.target.files[0]);
  };

  return (
    <div className="upload-section">
      <form onSubmit={handleUpload}>
        <input
          type="file"
          id="audio-input"
          name="audio"
          onChange={handleUploadFile}
        />
        <input type="text" id="title" name="title" />
        <button type="submit" disabled={isDisabled || loading}>
          Send
        </button>
      </form>
      {loading && <div>LOADING</div>}
      {/* TODO consider to adding it back */}
      {/* <div className="lines-container">
        {!!output && (
          <div>
            <Lines output={output} />
          </div>
        )}
      </div> */}
    </div>
  );
};

export default UploadPage;
