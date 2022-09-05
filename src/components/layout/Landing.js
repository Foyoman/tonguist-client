import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";

import '../../style.scss';


const Landing = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/learn')
    }
	  const token = localStorage.getItem('token')
		if (token) {
      const user = jwt.decode(token);
      if (user) { 
        navigate('/learn')
      }
		}	
	}, [localStorage.getItem('token')]);
  
  return (
    <div style={{ height: "75vh" }} className="container valign-wrapper">
      <div className="row">
        <div className="col s12 center-align">
          <h4>
            <b>Learn</b> new languages smarter and faster with{" "}
            <span style={{ fontFamily: "monospace" }}>tonguist</span>
          </h4>
          <p className="flow-text grey-text text-darken-1">
            Learn the  words that you really need, and improve your vocabulary in as little as 30 minutes per day.
          </p>
          <br />
          <div className="col s6">
            <Link
              to="/register"
              style={{
                width: "140px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Register
            </Link>
          </div>
          <div className="col s6">
            <Link
              to="/login"
              style={{
                width: "140px",
                borderRadius: "3px",
                letterSpacing: "1.5px"
              }}
              className="btn btn-large btn-flat waves-effect white black-text"
            >
              Log In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing;