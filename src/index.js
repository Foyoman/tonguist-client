import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import Home from './components/Home';
import Admin from './components/Admin';
import Learn from './components/Learn';
import CreateCard from './components/CreateCard';
import CardList from './components/CardList';
import EditCard from './components/EditCard';
import Register from './components/Register';
import 'bootstrap/dist/css/bootstrap.min.css';

import { HashRouter as Router, Route, Routes } from 'react-router-dom'

const routes = (
  <Router>
    <Routes>
      <Route element={<App />}>
        <Route path="/" element={ <Home /> } />
        <Route path="/admin" element={ <Admin />}>
          <Route path="/admin/create" element={ <CreateCard /> } />
          <Route path="/admin/cardlist" element={ <CardList /> } />
          <Route path="/admin/edit/:id" element={ <EditCard /> } />
        </Route>
        <Route path="/learn" element={ <Learn /> } />
        <Route path="/register" element={ <Register /> } />
      </Route>
    </Routes>
  </Router>
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  routes
);