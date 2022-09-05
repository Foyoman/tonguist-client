import React, { Component } from "react";
import { Link } from "react-router-dom";


class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper black">
            <a href="#" data-target="mobile-demo" class="sidenav-trigger"><i class="material-icons white-text text-darken-4">menu</i></a>
            <Link
              to="/"
              style={{
                fontFamily: "monospace"
              }}
              className="col s5 brand-logo center white-text"
            >
              <i className="material-icons">translate</i>
              tonguist
            </Link>

          </div>
        </nav>
        
      </div>
    );
  }
}

export default Navbar;

