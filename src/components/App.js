import { Outlet, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <div style={{ display: 'flex' }}>
        Nav coming soon |
        <Link to='/'>Home</Link> {" "} |
        <Link to='/admin'>Admin</Link> {" "} |
        <Link to='/learn'>Learn</Link> {" "} |
        <Link to='/register'>Register</Link> {" "} |
        <Link to='/login'>Login</Link> {" "} |
        <Link to='/dashboard'>Dashboard</Link>
      </div>
      <Outlet/>
    </div>
  );
}

export default App;
