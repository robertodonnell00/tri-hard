import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/plans" className="navbar-brand">
          <img src={logo} alt="Tri-Hard" className="navbar-logo" />
          <span>Tri-Hard</span>
        </Link>

        <div className="navbar-right">
          {token ? (
            <>
              <span className="navbar-user">{user?.name}</span>

              <button className="navbar-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-link">
                Login
              </Link>
              <Link to="/register" className="navbar-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}