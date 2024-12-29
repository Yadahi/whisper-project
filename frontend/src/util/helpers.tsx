export const convertToTime = (seconds: number | null) => {
  if (seconds === null) {
    return {
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }
  const hours = Math.floor(seconds / 3600);
  const minutesRemainer = seconds % 3600;
  const minutes = Math.floor(minutesRemainer / 60);
  const secondsRemainer = minutesRemainer % 60;

  return {
    hours,
    minutes,
    seconds: Math.floor(secondsRemainer),
  };
};
