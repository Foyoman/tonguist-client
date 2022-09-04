import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router';

function App() {
  const [user, setUser] = useState();
  const [name, setName] = useState('');
	const navigate = useNavigate();
	
	useEffect(() => {
	  const token = localStorage.getItem('token')
		if (token) {
			setUser(jwt.decode(token));
			if (!user) {
				localStorage.removeItem('token');
			} else {
				setName(user.name);
			}
		}	
	}, [])

  const handleLogOut = () => {
    localStorage.removeItem('token');
    navigate('');
  }
	
  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        Nav coming soon |
        <Link to='/'>Home</Link> {" "} |
        <Link to='/admin'>Admin</Link> {" "} |
        <Link to='/learn'>Learn</Link> {" "} |
        { !user ? 
          <span>
            <Link to='/register'>Register</Link> {" "} |
            <Link to='/login'>Login</Link> {" "} |
          </span>
        : 
          <span>
            <Link to='/dashboard'>Dashboard</Link> {" "} |
            <Link to='/' onClick={ handleLogOut }>Log Out</Link>
            { name }
          </span>
        }
      </div>
      <Outlet/>
    </div>
  );
}

export default App;
