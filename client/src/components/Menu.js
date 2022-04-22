import { Link, withRouter } from "react-router-dom";
import { useState } from "react";
import { signOut, isAuthenticated, userInfo } from '../utils/auth';
import {
  Collapse,
  NavbarToggler,
  Navbar,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from "reactstrap";


const isActive = (history, path) => {
  if (history.location.pathname === path) {
    return { color: "#ff9900" };
  } else {
    return { color: "white" };
  }
};

const Menu = ({ history }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNav = () => {
    console.log("clicked");
    setIsNavOpen(!isNavOpen);
  };

  return (
    <Navbar
      color="dark"
      dark expand="sm">
      <NavbarBrand href="/">
        StyleSense
      </NavbarBrand>


      <NavbarToggler onClick={handleNav} />

      <Collapse navbar isOpen={isNavOpen} >
        <Nav navbar className="ml-auto">
          <li className="nav-item">
            <Link className="nav-link" style={isActive(history, '/')} to="/">Home</Link>
          </li>
          {!isAuthenticated() && (<>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, '/login')} to="/login">Login</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, '/register')} to="/register">Register</Link>
            </li>
          </>)}

          {isAuthenticated() && (<>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, `/${userInfo().role}/dashboard`)} to={`/${userInfo().role}/dashboard`}>Dashboard</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" style={isActive(history, `/cart`)} to={`/cart`}>Cart</Link>
            </li>
            <li className="nav-item">
              <span className="nav-link" style={{ cursor: 'pointer', color: 'white' }} onClick={() => {
                signOut(() => {
                  history.push('/login')
                });
              }}> Log Out</span>
            </li>
          </>)}
        </Nav>
      </Collapse>
    </Navbar>

  );
};

export default withRouter(Menu);
