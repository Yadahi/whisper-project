import { memo, useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import AudioPlayer from "./AudioPlayer";
import Lines from "./Lines";
import openSocket from "socket.io-client";
import Search from "./Search";
import { useParams } from "react-router";
import Title from "./Title";
import "./MainSection.css";

// TODO detect click outside

const MainSection = memo(({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const audioPlayerRef = useRef(null);
  const formRef = useRef(null);

  const { state, contentDispatch } = useContent();
  const { file, audioUrl, output } = state;
  const params = useParams();

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

  useEffect(() => {
    if (!params.id || state.currentId === params.id) {
      return; // Don't refetch if we already have this data
    }

    const fetchData = async () => {
      setLoading(true); // Start loading
      setError(null); // Clear previous errors

      try {
        const response = await fetch(`http://localhost:3000/${params.id}`);

        if (!response.ok) {
          // Extract the error message from the response body
          const errorData = await response.json();
          throw new Error(
            errorData.message || `HTTP error! Status: ${response.status}`
          );
        }

        const data = await response.json();
        const { _id, path, transcriptionData, ...file } = data;

        contentDispatch({
          type: "SET_CONTENT",
          payload: {
            file: file,
            audioUrl: `${import.meta.env.VITE_APP_ASSET_URL}/${path}`,
            output: transcriptionData,
            currentId: params.id,
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message); // Use the error message from the backend
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, [params.id, state.currentId]);

  const handlePlayFromTime = (seconds) => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current?.play();
      audioPlayerRef.current?.handleTime(seconds);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="main">
      <div className="content">
        <Search />
        <AudioPlayer
          audioUrl={audioUrl}
          file={file}
          type={file?.type}
          ref={audioPlayerRef}
        />

        <Title title={file?.title} />
      </div>
      <div className="lines-container">
        {!!output && (
          <div>
            <Lines output={output} play={handlePlayFromTime} />
          </div>
        )}
      </div>
    </div>
  );
});

export default MainSection;
