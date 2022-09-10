import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './layout/Navbar';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

function App() {

  const theme = createTheme({
    palette: {
      mode: 'dark',
    },
  });
	
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

