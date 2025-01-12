import { useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import AudioPlayer from "./AudioPlayer";
import Lines from "./Lines";
import openSocket from "socket.io-client";
import Search from "./Search";

const MainSection = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [audioFile, setAudioFile] = useState("");
  const audioPlayerRef = useRef(null);
  const formRef = useRef(null);

  const { state, contentDispatch } = useContent();
  const { file, audioUrl, output } = state;

  useEffect(() => {
    const socket = openSocket("http://localhost:3000");
    socket.on("transcription", (data) => {
      console.log(data);

      const line = data.parsedLine;

      contentDispatch({
        type: "ADD_LINE",
        payload: line,
      });
    });

    return () => socket.disconnect();
  }, []);

  const handleAudioChange = (e) => {
    setAudioFile({});
    const selectedFile = e.target.files[0];
    setAudioFile(selectedFile);
    console.log("selected file", selectedFile);
    console.log("audio url", audioUrl);

    contentDispatch({ type: "SET_CONTENT", payload: { file: selectedFile } });

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      console.log("fileUrl", fileUrl);

      //   TODO do not save the audioUrl

      contentDispatch({ type: "SET_CONTENT", payload: { audioUrl: fileUrl } });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    contentDispatch({ type: "SET_CONTENT", payload: { output: [] } });
    setLoading(true);
    const formData = new FormData();
    // TODO maybe remove audiofile
    formData.append("audio", audioFile);
    formData.append("title", e.target.title.value);

    fetch("http://localhost:3000/", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch transcription");
        }
        return response.json();
      })
      .then((data) => {
        setLoading(false);
        onRefresh((prev) => !prev);

        if (formRef.current) {
          formRef.current.reset();
        }

        contentDispatch({ type: "SET_CONTENT", payload: { file: null } });
        contentDispatch({ type: "SET_CONTENT", payload: { audioUrl: "" } });
      })
      .catch((error) => {
        console.error("Error:", error);
        throw error;
      });
  };

  const handlePlayFromTime = (seconds) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current?.play();
      audioPlayerRef.current?.handleTime(seconds);
    }
  };

  return (
    <div className="main">
      <Search />
      <AudioPlayer
        audioUrl={audioUrl}
        file={file}
        type={file?.type}
        ref={audioPlayerRef}
      />

      {loading && <div>LOADING</div>}
      <form ref={formRef} onSubmit={submitHandler}>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title" />
        <label htmlFor="audio-input"></label>
        <input
          type="file"
          id="audio-input"
          name="audio"
          onChange={handleAudioChange}
        />
        <button type="submit">Send</button>
      </form>
      {!!output && (
        <div>
          <Lines output={output} play={handlePlayFromTime} />
        </div>
      )}
    </div>
  );
};

export default MainSection;
