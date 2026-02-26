import { NavLink, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-brand">Shadowdark Tracker</div>
        <div className="nav-links">
          <NavLink to="/" end>Monsters</NavLink>
          <NavLink to="/encounters">Encounters</NavLink>
          <NavLink to="/combat">Combat</NavLink>
          <NavLink to="/history">History</NavLink>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
