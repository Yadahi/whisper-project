import { useContent } from "../context/ContentContext";

const SideItem = ({ item, onDeleteProduct }) => {
  const { _id, title, originalname } = item;
  const { contentDispatch } = useContent();

  const handleProductClick = (id) => {
    console.log("Product clicked", id);
    try {
      fetch(`http://localhost:3000/${id}`, {
        method: "GET",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log("DATA", data);

          contentDispatch({
            type: "SET_CONTENT",
            payload: {
              file: data.file,
              audioUrl: `${import.meta.env.VITE_APP_ASSET_URL}/${data.path}`,
              output: data.transcriptionData,
            },
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDelete = (id) => {
    try {
      fetch(`http://localhost:3000/${id}`, {
        method: "DELETE",
      });
      onDeleteProduct(id);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  };

  return (
    <li
      className={`sidepanel-item ${true ? "active" : ""}`}
      onClick={() => handleProductClick(_id)}
    >
      <div>{title}</div>
      <div>{originalname}</div>
      <div onClick={() => handleDelete(_id)}>X</div>
    </li>
  );
};

export default SideItem;
