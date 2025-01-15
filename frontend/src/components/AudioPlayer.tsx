import {
  FC,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useVoiceVisualizer, VoiceVisualizer } from "react-voice-visualizer";
import { useContent } from "../context/ContentContext";

import {
  SET_TOTAL_SECONDS,
  SET_HOURS,
  SET_MINUTES,
  SET_SECONDS,
  useTime,
  useTimeDispatch,
} from "../context/TimeContext";
import { convertToTime } from "../util/helpers";

// TODO add type for ref
type Props = {
  audioUrl: string;
  type: string;
  ref: any;
};

const AudioPlayer = forwardRef(function AudioPlayer(props, ref) {
  // const AudioPlayer: FC<Props> = ({ audioUrl = "", type, ref }) => {
  const { state } = useContent();
  const { audioUrl, file } = state;
  const audioRef = useRef<HTMLAudioElement | null>(audioUrl ? audioUrl : null);
  const [duration, setDuration] = useState<number | null>(null);
  const timeState = useTime();
  const timeDispatch = useTimeDispatch();
  //   const [currentTime, setCurrentTime] = useState(0);

  const [width, setWidth] = useState("100%");
  const [height, setHeight] = useState("200");
  const [speed, setSpeed] = useState(3);
  const [barWidth, setBarWidth] = useState(2);
  const [gap, setGap] = useState(1);
  const [rounded, setRounded] = useState(5);
  const [isControlPanelShown, setIsControlPanelShown] = useState(true);
  const [isDownloadAudioButtonShown, setIsDownloadAudioButtonShown] =
    useState(false);
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [mainBarColor, setMainBarColor] = useState("#FFFFFF");
  const [secondaryBarColor, setSecondaryBarColor] = useState("#5e5e5e");
  const [fullscreen, setFullscreen] = useState(false);
  const [onlyRecording, setOnlyRecording] = useState(false);
  const [animateCurrentPick, setAnimateCurrentPick] = useState(true);
  const [isDefaultUIShown, setIsDefaultUIShown] = useState(true);
  const [defaultAudioWaveIconColor, setDefaultAudioWaveIconColor] =
    useState(mainBarColor);
  const [defaultMicrophoneIconColor, setDefaultMicrophoneIconColor] =
    useState(mainBarColor);
  const [isProgressIndicatorShown, setIsProgressIndicatorShown] =
    useState(true);
  const [isProgressIndicatorTimeShown, setIsProgressIndicatorTimeShown] =
    useState(true);
  const [isProgressIndicatorOnHoverShown, setIsProgressIndicatorOnHoverShown] =
    useState(true);
  const [
    isProgressIndicatorTimeOnHoverShown,
    setIsProgressIndicatorTimeOnHoverShown,
  ] = useState(true);

  const recorderControls = useVoiceVisualizer();

  const { setPreloadedAudioBlob } = recorderControls;

  useEffect(() => {
    const audioElement = audioRef.current;
    const handleTimeUpdate = () => {
      if (audioElement) {
        timeDispatch({
          type: SET_TOTAL_SECONDS,
          payload: audioElement.currentTime,
        });
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
  }, [audioUrl, file]);

  useEffect(() => {
    if (!audioUrl) return;

    const createBlobFromServerFile = async () => {
      try {
        const response = await fetch(audioUrl);

        if (!response.ok) {
          throw new Error("Failed to fetch the audio file.");
        }

        const blob = await response.blob();

        setPreloadedAudioBlob(blob);
      } catch (error) {
        console.error("Error creating blob from server file:", error);
      }
    };

    createBlobFromServerFile();
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
        <source src={audioUrl} type={file?.type} />
      </audio>

      <VoiceVisualizer
        controls={recorderControls}
        width={width}
        height={height}
        speed={speed}
        backgroundColor={backgroundColor}
        mainBarColor={mainBarColor}
        secondaryBarColor={secondaryBarColor}
        barWidth={barWidth}
        gap={gap}
        rounded={rounded}
        isControlPanelShown={isControlPanelShown}
        isDownloadAudioButtonShown={isDownloadAudioButtonShown}
        fullscreen={fullscreen}
        onlyRecording={onlyRecording}
        animateCurrentPick={animateCurrentPick}
        isDefaultUIShown={isDefaultUIShown}
        defaultAudioWaveIconColor={defaultAudioWaveIconColor}
        defaultMicrophoneIconColor={defaultMicrophoneIconColor}
        isProgressIndicatorShown={isProgressIndicatorShown}
        isProgressIndicatorTimeShown={isProgressIndicatorTimeShown}
        isProgressIndicatorOnHoverShown={isProgressIndicatorOnHoverShown}
        isProgressIndicatorTimeOnHoverShown={
          isProgressIndicatorTimeOnHoverShown
        }
      />

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
