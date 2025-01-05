const SideItem = ({ item, onDeleteProduct }) => {
  const { _id, title, originalname } = item;

  const handleProductClick = (id) => {
    console.log("Product clicked", id);
    try {
      fetch(`http://localhost:3000/${id}`, {
        method: "GET",
      })
        .then((result) => {
          return result;
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
