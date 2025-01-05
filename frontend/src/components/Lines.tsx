import { useTime } from "../context/TimeContext";

const Lines = ({ output, play }) => {
  return (
    <div className="lines-container">
      {output.map((line, index) => (
        <Line key={line.id} line={line} play={play} />
      ))}
    </div>
  );
};

export default Lines;

const Line = ({ line, play }) => {
  const { start, end, text } = line;
  const timeState = useTime();

  const handlePlay = () => {
    play(Math.floor(start));
  };

  const highlight =
    timeState?.totalSeconds >= Math.floor(start) &&
    timeState?.totalSeconds < Math.floor(end);

  return (
    <div className={`line-row ${highlight ? "highlight" : ""}`}>
      <div className="line-time">
        {Math.floor(start)} - {Math.floor(end)}
      </div>
      <div onClick={handlePlay}>Play from here</div>
      <div className="line-text">{text}</div>
    </div>
  );
};
