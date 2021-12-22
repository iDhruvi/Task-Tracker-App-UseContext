import { useLocation } from "react-router-dom";
import { ShowContext } from "./Context";
import { useContext } from "react";
export default function Header({ onBtnAdd }) {
  //style={{ backgroundColor: "green" }}
  const location = useLocation();
  const showAdd = useContext(ShowContext);
  return (
    <div>
      <header className="header">
        <h1>Task Traker App</h1>
        {location.pathname === '/' && <button
          className="btn"
          style={{ backgroundColor: "green" }}
          onClick={onBtnAdd}
        >
          {showAdd ? "Close" : "Add"}
        </button>}
      </header>
    </div>
  );
}
