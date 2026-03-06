import { NavLink, Outlet } from "react-router-dom";

export function RootLayout() {
  return (
    <div className="container">
      <div className="nav">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/settings">Settings</NavLink>
      </div>
      <Outlet />
    </div>
  );
}

