import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Home from './components/Home';
import Admin from './components/admin/Admin';
import Learn from './components/Learn';
import CreateCard from './components/admin/CreateCard';
import CardList from './components/admin/CardList';
import EditCard from './components/admin/EditCard';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/hub/Dashboard';
import Landing from './components/layout/Landing';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import Hub from './components/hub/Hub';
import Profile from './components/hub/Profile';
import './style.scss'


const routes = (
  <Router>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={ <Landing /> } />
        <Route path="/admin" element={ <Admin />}>
          <Route path="/admin/create" element={ <CreateCard /> } />
          <Route path="/admin/cardlist" element={ <CardList /> } />
          <Route path="/admin/edit/:id" element={ <EditCard /> } />
        </Route>
        <Route path="/register" element={ <Register /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/learn" element={ <Learn /> } />
        <Route element={<Hub />}>
          <Route path="/dashboard" element={ <Dashboard /> } />
          <Route path="/profile" element={ <Profile /> } />
        </Route>
      </Route>
    </Routes>
  </Router>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  routes
);