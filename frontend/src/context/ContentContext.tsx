import { createContext, useReducer, useContext } from "react";

const SET_CONTENT = "SET_CONTENT";
const CLEAR_CONTENT = "CLEAR_CONTENT";
const ADD_LINE = "ADD_LINE";

const initialState = {
  file: null,
  audioUrl: "",
  output: [],
};

const contentReducer = (state, action) => {
  console.trace(action.payload);

  switch (action.type) {
    case SET_CONTENT:
      return {
        ...state,
        ...action.payload,
      };
    case CLEAR_CONTENT:
      return {
        initialState,
      };
    case ADD_LINE:
      return {
        ...state,
        output: [...state.output, action.payload],
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [state, contentDispatch] = useReducer(contentReducer, initialState);

  return (
    <ContentContext.Provider value={{ state, contentDispatch }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const contentContext = useContext(ContentContext);
  if (!contentContext) {
    throw new Error("useContent must be used within a ContentProvider");
  }
  return contentContext;
};
