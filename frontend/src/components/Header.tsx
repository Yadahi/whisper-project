import { Link } from "react-router";

const Header = () => {
  return (
    <div>
      <button>
        <Link to="/">Add New</Link>
      </button>
    </div>
  );
};

export default Header;
