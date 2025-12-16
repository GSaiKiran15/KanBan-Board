import { Link, useNavigate } from "react-router-dom";
import useUser from "../../useUser";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config.js";
import "./NavBar.css";

export default function NavBar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/projects" className="navbar-brand">
          <span className="brand-icon">
            <img src="/logo.png" className="kan"></img>
          </span>
          {/* <span className="brand-text">Kanban</span> */}
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">
            Projects
          </Link>

          <div className="navbar-user">
            {user && (
              <>
                <span className="user-email">{user.displayName}</span>
                <button onClick={handleLogout} className="logout-btn">
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
