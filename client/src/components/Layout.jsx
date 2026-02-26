import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UsageBanner from './UsageBanner';

export default function Layout() {
  const { user, logout } = useAuth();

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
        <div className="nav-user">
          <NavLink to="/account" className="user-name">{user?.name}</NavLink>
          <span className={`user-tier tier-${user?.tier}`}>{user?.tier}</span>
          <button onClick={logout} className="btn btn-sm btn-logout">Logout</button>
        </div>
      </nav>
      <UsageBanner />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
