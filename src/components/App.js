import React, { useEffect, useState } from 'react';
import jwt from 'jsonwebtoken'; 
import { Outlet, Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import Navbar from './layout/Navbar';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {
  const [user, setUser] = useState('');
	const navigate = useNavigate();
	
	useEffect(() => {
	  const token = localStorage.getItem('token')
		if (token) {
      const user = jwt.decode(token);
			setUser(user);
		}	
	}, [localStorage.getItem('token')]);

  // const handleLogOut = () => {
  //   localStorage.removeItem('token');
  //   setUser('');
  //   setName('');
  //   navigate('/');
  // }

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => 
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light'
        }
      }),
    [prefersDarkMode],
  );
	
  return (
    <ThemeProvider theme={ theme }>
      <CssBaseline />
      <div className="App">
        <Navbar />
        <Outlet />
        {/* <div style={{ display: 'flex' }}>
          Nav coming soon |
          <Link to='/'>Home</Link> {" "} |
          <Link to='/admin'>Admin</Link> {" "} |
          <Link to='/learn'>Learn</Link> {" "} |
          { !currentUser ? 
            <span>
              <Link to='/register'>Register</Link> {" "} |
              <Link to='/login'>Login</Link> {" "} |
            </span>
          : 
            <span>
              <Link to='/dashboard'>Dashboard</Link> {" "} |
              <Link to='/' onClick={ handleLogOut }>Log Out</Link> {" "} |
              { name }
            </span>
          }
        </div>  */}
      </div>
    </ThemeProvider>
  );
}

export default App;

