import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import {
  SET_TOTAL_SECONDS,
  SET_HOURS,
  SET_MINUTES,
  SET_SECONDS,
  useTime,
  useTimeDispatch,
} from "../reducers/timeReducer";
import { convertToTime } from "../util/helpers";

// TODO add type for ref
type Props = {
  audioUrl: string;
  type: string;
  ref: any;
};

const AudioPlayer = forwardRef(function AudioPlayer(
  { audioUrl = "", type },
  ref
) {
  // const AudioPlayer: FC<Props> = ({ audioUrl = "", type, ref }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const timeState = useTime();
  const timeDispatch = useTimeDispatch();
  //   const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audioElement = audioRef.current;
    const handleTimeUpdate = () => {
      if (audioElement) {
        timeDispatch({
          type: SET_TOTAL_SECONDS,
          payload: audioElement.currentTime,
        });
        // setCurrentTime(audioElement.currentTime);
      }
    };
    if (audioElement) {
      audioElement.addEventListener("timeupdate", handleTimeUpdate);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      }
    };
  }, []);

  //   update audio when audioUrl changes
  useEffect(() => {
    if (audioRef.current && audioUrl) {
      audioRef.current.load();
    }
  }, [audioUrl]);

  //   update duration when audioUrl changes
  useEffect(() => {
    const audioElement = audioRef.current;
    const handleLoadedMetadata = () => {
      if (audioElement) {
        setDuration(audioElement.duration);
      }
    };

    if (audioElement) {
      audioElement.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, [audioUrl]);

  useImperativeHandle(
    ref,
    () => {
      return {
        play() {
          if (audioRef.current) {
            audioRef.current?.play();
          }
        },
        handleTime(seconds) {
          if (audioRef.current) {
            audioRef.current.currentTime = seconds;
          }
          timeDispatch({
            type: SET_TOTAL_SECONDS,
            payload: seconds,
          });
        },
      };
    },
    []
  );

  const handleSeconds = (e) => {
    const seconds = e.target.value;
    const totalSeconds =
      timeState.hours * 3600 + timeState.minutes * 60 + seconds;
    if (audioRef.current) {
      audioRef.current.currentTime = totalSeconds;
    }
    timeDispatch({ type: SET_SECONDS, payload: seconds });
  };

  const handleMinutes = (e) => {
    const minutes = e.target.value;
    const totalSeconds =
      timeState.hours * 3600 + minutes * 60 + timeState.seconds;
    if (audioRef.current) {
      audioRef.current.currentTime = totalSeconds;
    }
    timeDispatch({ type: SET_MINUTES, payload: minutes });
  };

  const handleHours = (e) => {
    const hours = e.target.value;
    const totalSeconds =
      hours * 3600 + timeState.minutes * 60 + timeState.seconds;
    if (audioRef.current) {
      audioRef.current.currentTime = totalSeconds;
    }
    timeDispatch({ type: SET_HOURS, payload: hours });
  };

  //   TODO call only when duration change
  const maxTime = convertToTime(duration);

  return (
    <div className="audio-player">
      <audio controls ref={audioRef}>
        <source src={audioUrl} type={type} />
      </audio>
      <div>
        <label htmlFor="time">Time</label>
        {!!timeState.hours && (
          <input
            type="number"
            name="hour"
            min={0}
            max={maxTime.hours}
            value={timeState.hours}
            onChange={handleHours}
          />
        )}
        <input
          type="number"
          name="minutes"
          min={0}
          max={maxTime.minutes}
          value={timeState.minutes}
          onChange={handleMinutes}
        />
        <input
          type="number"
          name="seconds"
          min={0}
          max={maxTime.seconds}
          value={timeState.seconds}
          onChange={handleSeconds}
        />
      </div>
    </div>
  );
});

export default AudioPlayer;
