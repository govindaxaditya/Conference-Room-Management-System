import React from "react";
import logo from "../assets/iol.png";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "/login";
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <a className="navbar-brand" href="/">
          <img src={logo} alt="BookNow Logo" style={{ height: "50px" }} />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span><i className="fa-solid fa-bars"></i></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            {user && (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="fa-solid fa-user"></i> {user.name}
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                  {!user.isAdmin && (
                    <>
                      <a className="dropdown-item" href="/profile">
                        Profile
                      </a>
                      <a className="dropdown-item" href="/home">
                        Home
                      </a>
                      <div className="dropdown-divider"></div>
                    </>
                  )}
                  {user.isAdmin && (
                    <>
                      <a className="dropdown-item" href="/admin">
                        Dashboard
                      </a>
                      <div className="dropdown-divider"></div>
                    </>
                  )}
                  <a className="dropdown-item" href="/" onClick={logout}>
                    Logout
                  </a>
                </div>
              </div>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
