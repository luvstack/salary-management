import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';

import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import EmployeeDetails from './pages/EmployeeDetail';
import Employees from './pages/Employees';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <Navigate
                to="/employees"
                replace
              />
            }
          />

          <Route
            path="/employees"
            element={<Employees />}
          />

          <Route
            path="/employees/:id"
            element={<EmployeeDetails />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;