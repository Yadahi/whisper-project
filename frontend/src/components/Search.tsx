import { useState } from "react";
import { useContent } from "../context/ContentContext";

const Search = () => {
  const [searchItem, setSearchItem] = useState("");
  const { state, contentDispatch } = useContent();
  const { output } = state;

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const updatedOutput = output.map((line) => {
      const cleanedText = line.text.replace(/<\/?mark>/g, "");

      if (
        searchTerm.trim() &&
        cleanedText.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        const highlightedText = cleanedText.replace(
          new RegExp(searchTerm, "gi"),
          (word) => {
            return `<mark>${word}</mark>`;
          }
        );
        return { ...line, text: highlightedText };
      }
      return { ...line, text: cleanedText };
    });

    contentDispatch({
      type: "SET_CONTENT",
      payload: { output: updatedOutput },
    });
  };

  return (
    <div className="search-container">
      <input
        type="text"
        onChange={handleInputChange}
        value={searchItem}
        placeholder="Type to search"
      />
    </div>
  );
};

export default Search;
