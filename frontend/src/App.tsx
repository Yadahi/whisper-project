import { useEffect, useRef, useState } from "react";
import openSocket from "socket.io-client";
import "./App.css";
import AudioPlayer from "./components/AudioPlayer";
import { TimeProvider } from "./context/TimeContext";
import Lines from "./components/Lines";
import SidePanel from "./components/SidePanel";

const App = () => {
  const [file, setFile] = useState({});
  const [audioUrl, setAudioUrl] = useState("");
  const [output, setOutput] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const audioPlayerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const socket = openSocket("http://localhost:3000");
    socket.on("transcription", (data) => {
      const line = JSON.parse(data.line);
      setOutput((prevOutput) => [...prevOutput, line]);
    });

    return () => socket.disconnect();
  }, []);

  const handleAudioChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile);

    setFile(selectedFile);

    if (selectedFile) {
      const fileUrl = URL.createObjectURL(selectedFile);
      setAudioUrl(fileUrl);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setOutput([]);
    setLoading(true);
    const formData = new FormData();
    formData.append("audio", file);
    formData.append("title", e.target.title.value);
    formData.append("type", file.type);
    formData.append("size", file.size);

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
        setRefreshFlag((prev) => !prev);

        if (formRef.current) {
          formRef.current.reset();
        }
        setFile({});
        setAudioUrl("");
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
    <div className="App">
      <TimeProvider>
        <SidePanel refreshFlag={refreshFlag} />
        <div className="main">
          <AudioPlayer
            audioUrl={audioUrl}
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
      </TimeProvider>
    </div>
  );
};

export default App;
