import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "./Title.css";

type Props = {
  title: string;
};

// TODO alternatively remove useState and use onTitleChange={(newTitle) => contentDispatch({ type: "SET_CONTENT", payload: { file: { ...file, title: newTitle } }  })}
const Title: FC<Props> = ({ title }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  // detect click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsEditable(false);
        triggerTitleUpdate(currentTitle);
      }
    };

    if (isEditable) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditable, currentTitle]);

  //   TODO send update request to update title
  const triggerTitleUpdate = useCallback((newTitle: string) => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      console.log("debounce", newTitle);
    }, 500);
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setCurrentTitle(newTitle);
    triggerTitleUpdate(newTitle);
  };

  const getTitle = () => {
    if (isEditable || !currentTitle) {
      return (
        <label htmlFor="title" className="title-label">
          <span className="title-label-text">Type title:</span>
          <input
            ref={inputRef}
            type="text"
            id="title"
            name="title"
            value={currentTitle}
            onChange={handleInputChange}
          />
        </label>
      );
    } else {
      return <h2 onClick={() => setIsEditable(true)}>{currentTitle}</h2>;
    }
  };

  return <div className="title-container">{getTitle()}</div>;
};

export default Title;
