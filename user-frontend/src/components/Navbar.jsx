import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const navLinkClass = ({ isActive }) =>
  `nav-link ${isActive ? "nav-link--active" : ""}`;

function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="container nav-bar">
        <Link to="/" className="brand-mark" aria-label="Home">
          <img
            className="brand-mark__icon"
            src="/naruto-logo.jpg.webp"
            onError={(event) => { event.currentTarget.src = "/naruto-ramen-bg.jpg"; }}
            alt="Naruto eating food"
          />
          <div>
            <strong>Naruto</strong>
            <small>Food</small>
          </div>
        </Link>

        <nav className="main-nav">
          <NavLink to="/" className={navLinkClass} end>
            Home
          </NavLink>
          <NavLink to="/restaurants" className={navLinkClass}>
            Restaurants
          </NavLink>
          <NavLink to="/orders" className={navLinkClass}>
            Orders
          </NavLink>
        </nav>

        <div className="nav-actions">
          <Link to="/cart" className="cart-badge">
            Cart <span>{totalItems}</span>
          </Link>

          {user ? (
            <>
              <Link to="/profile" className="profile-link">
                {user.name || "Profile"}
              </Link>
              <button className="ghost-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="ghost-button">Login</Link>
              <Link to="/register" className="primary-button">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
