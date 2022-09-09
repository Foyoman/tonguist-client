import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';

import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = React.useMemo(
    () => 
      createTheme({
        palette: {
          mode: 'dark'
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
      </div>
    </ThemeProvider>
  );
}

export default App;

