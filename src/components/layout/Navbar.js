import React, { Component } from "react";
import { Link } from "react-router-dom";
import '../../style.scss';

class Navbar extends Component {
  render() {
    return (
      <div className="navbar-fixed">
        <nav className="z-depth-0">
          <div className="nav-wrapper black">
            <Link
              to="/dashboard"
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

