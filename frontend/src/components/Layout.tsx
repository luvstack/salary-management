import {
    NavLink,
    Outlet,
  } from 'react-router-dom';
  
  function Layout() {
    return (
      <div className="app-layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <h2>ACME</h2>
            <span>HR Management</span>
          </div>
  
          <nav className="sidebar-nav">
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              Employees
            </NavLink>
  
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? 'nav-link active'
                  : 'nav-link'
              }
            >
              Compensation
            </NavLink>
          </nav>
        </aside>
  
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    );
  }
  
  export default Layout;