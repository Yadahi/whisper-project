import { useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import AudioPlayer from "./AudioPlayer";
import Lines from "./Lines";
import openSocket from "socket.io-client";
import Search from "./Search";

const MainSection = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const audioPlayerRef = useRef(null);
  const formRef = useRef(null);

  const { state, contentDispatch } = useContent();
  const { file, audioUrl, output } = state;

  useEffect(() => {
    const socket = openSocket("http://localhost:3000");
    socket.on("transcription", (data) => {
      const line = data.parsedLine;

      contentDispatch({
        type: "ADD_LINE",
        payload: line,
      });
    });

    return () => socket.disconnect();
  }, []);

  const handleAudioChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      contentDispatch({
        type: "SET_CONTENT",
        payload: { audioUrl: fileUrl, file: null, output: [] },
      });
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();

    formData.append("title", e.target.title.value);
    formData.append("audio", file);

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
