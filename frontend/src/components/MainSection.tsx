import { memo, useEffect, useRef, useState } from "react";
import { useContent } from "../context/ContentContext";
import AudioPlayer from "./AudioPlayer";
import Lines from "./Lines";

import Search from "./Search";
import { useParams } from "react-router";
import Title from "./Title";
import "./MainSection.css";

// TODO detect click outside

const MainSection = memo(({ onRefresh }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const audioPlayerRef = useRef(null);

  const { state, contentDispatch } = useContent();
  const { file, audioUrl, output, id } = state;
  const params = useParams();

  useEffect(() => {
    if (!params.id || id === params.id) {
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3000/${params.id}`);

        if (!response.ok) {
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
            id: params.id,
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
  }, [params.id, id]);

  // TODO revise if it is necessary
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
