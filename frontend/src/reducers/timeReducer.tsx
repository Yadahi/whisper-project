import { createContext, useContext, useReducer } from "react";
import { convertToTime } from "../util/helpers";

export const SET_HOURS = "SET_HOURS";
export const SET_MINUTES = "SET_MINUTES";
export const SET_SECONDS = "SET_SECONDS";
export const SET_TOTAL_SECONDS = "SET_TOTAL_SECONDS";

const initialTimeState: TimeState = {
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalSeconds: 0,
};

export type TimeState = {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
};

type Action =
  | { type: "SET_HOURS"; payload: number }
  | { type: "SET_MINUTES"; payload: number }
  | { type: "SET_SECONDS"; payload: number }
  | { type: "SET_TOTAL_SECONDS"; payload: number };

const TimeContext = createContext(null);
const TimeDispatchContext = createContext(null);

export const TimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timeReducer, initialTimeState);

  return (
    <TimeContext.Provider value={state}>
      <TimeDispatchContext.Provider value={dispatch}>
        {children}
      </TimeDispatchContext.Provider>
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  return useContext(TimeContext);
};

export const useTimeDispatch = () => {
  return useContext(TimeDispatchContext);
};

export const timeReducer = (state: TimeState, action: Action) => {
  switch (action.type) {
    case SET_HOURS:
      return {
        ...state,
        hours: action.payload,
        totalSeconds:
          action.payload * 3600 + state.minutes * 60 + state.seconds,
      };
    case SET_MINUTES:
      return {
        ...state,
        minutes: action.payload,
        totalSeconds: state.hours * 3600 + action.payload * 60 + state.seconds,
      };
    case SET_SECONDS:
      return {
        ...state,
        seconds: action.payload,
        totalSeconds: state.hours * 3600 + state.minutes * 60 + action.payload,
      };
    case SET_TOTAL_SECONDS:
      const { hours, minutes, seconds } = convertToTime(action.payload);
      return {
        hours,
        minutes,
        seconds,
        totalSeconds: action.payload,
      };
    default:
      return state;
  }
};
