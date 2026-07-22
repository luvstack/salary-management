import {
    useEffect,
    useState,
  } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { getEmployees } from '../api/employees.api';
  
  import type {
    IEmployee,
    Status,
  } from '../types/employee';
  
  function Employees() {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState<IEmployee[]>([]);
  
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
    });

    useState(0);
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const emptyFilters = {
        country: '',
        department: '',
        status: '',
        minSalary: '',
        maxSalary: '',
      };
      
    const [filters, setFilters] = useState(emptyFilters);
    const [appliedFilters, setAppliedFilters] = useState(emptyFilters);


    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => {
          const value =
            search.trim();
      
          setDebouncedSearch(value);
      
          setPagination((prev) => ({
            ...prev,
            page: 1,
          }));
        }, 500);
      
        return () => {
          clearTimeout(timer);
        };
    }, [search]);
  
  
    useEffect(() => {
      async function loadEmployees() {
        try {
          setLoading(true);
          setError('');

          const {page, limit} = pagination;
          const {country, department, maxSalary, minSalary, status} = appliedFilters;
          const response = await getEmployees({
            page,
            limit,
            search: debouncedSearch || undefined,
            country: country || undefined,
            department: department || undefined,
            status: status ? (status as Status) : undefined,
            minSalary: minSalary ? Number(minSalary) : undefined,
            maxSalary: maxSalary ? Number(maxSalary) : undefined,
          });
  
          setEmployees(response.data.data);
          setPagination(response.data.pagination);
        } catch(error) {
            setError(error instanceof Error ? error.message : 'Failed to load employees');
        } finally {
          setLoading(false);
        }
      }
  
      void loadEmployees();
    }, [pagination.page, debouncedSearch, appliedFilters]);

    function handleApplyFilters() {
        setPagination((prev) => ({
          ...prev,
          page: 1,
        }));
      
        setAppliedFilters(filters);
    }
      
    function handleClearFilters() {
        setFilters(emptyFilters);
      
        setAppliedFilters(
          emptyFilters,
        );
      
        setPagination((prev) => ({
          ...prev,
          page: 1,
        }));
    }

  
    return (
      <div className="employees-page">
        <div className="page-header">
          <div>
            <h1>Employees</h1>
  
            <p>
              Manage and review employee
              compensation
            </p>
          </div>
  
          <div className="employee-count">
            {pagination.total.toLocaleString()}{' '}
            employees
          </div>
        </div>

        <div className="employee-toolbar">
            <input
                type="text"
                value={search}
                placeholder="Search by name, email or employee ID..."
                onChange={(event) =>
                setSearch(
                    event.target.value,
                )
                }
                className="search-input"
            />

            <select
                value={filters.country}
                    onChange={(event) =>
                        setFilters((prev) => ({
                        ...prev,
                        country: event.target.value,
                        }))
                    }
                >
                <option value="">All Countries</option>
                <option value="India">India</option>
                <option value="USA">USA</option>
                <option value="UK">UK</option>
                <option value="Canada">Canada</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
            </select>

            <select
                value={filters.department}
                onChange={(event) =>
                    setFilters((prev) => ({
                        ...prev,
                        department: event.target.value,
                    }))
                }
            >
                <option value="">All Departments</option>
                <option value="Engineering">Engineering</option>
                <option value="Product">Product</option>
                <option value="Sales">Sales</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="HR">HR</option>
            </select>

            <select
                value={filters.status}
                onChange={(event) =>
                    setFilters((prev) => ({
                    ...prev,
                    status: event.target.value,
                    }))
                }
            >
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
            </select>

            <input
                type="number"
                placeholder="Min salary"
                value={filters.minSalary}
                onChange={(event) =>
                    setFilters((prev) => ({
                    ...prev,
                    minSalary: event.target.value,
                    }))
                }
            />

            <input
                type="number"
                placeholder="Max salary"
                value={filters.maxSalary}
                onChange={(event) =>
                    setFilters((prev) => ({
                    ...prev,
                    maxSalary: event.target.value,
                    }))
                }
            />

            <button
                type="button"
                className="filter-button primary"
                onClick={handleApplyFilters}
            >
                Apply Filters
            </button>

            <button
                type="button"
                className="filter-button"
                onClick={handleClearFilters}
            >
            Clear
            </button>

        </div>
  
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
  
        <div className="table-card">
          {loading ? (
            <div className="table-message">
              Loading employees...
            </div>
          ) : (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Employee</th>
  
                  <th>
                    Employee ID
                  </th>
  
                  <th>
                    Department
                  </th>
  
                  <th>Job Title</th>
  
                  <th>Country</th>
  
                  <th>
                    Current Salary
                  </th>
  
                  <th>Status</th>
                </tr>
              </thead>
  
              <tbody>
                {employees.map(
                  (employee) => (
                    <tr key={employee.id} className="clickable-row"
                        onClick={() =>
                        navigate(
                          `/employees/${employee.id}`,
                        )}
                    >
                      <td>
                        <div className="employee-name">
                          {employee.firstName}{' '}
                          {employee.lastName}
                        </div>
  
                        <div className="employee-email">
                          {employee.email}
                        </div>
                      </td>
  
                      <td>
                        {
                          employee.employeeCode
                        }
                      </td>
  
                      <td>
                        {
                          employee.department
                        }
                      </td>
  
                      <td>
                        {employee.jobTitle}
                      </td>
  
                      <td>
                        {employee.country}
                      </td>
  
                      <td>
                        {employee.currentSalary
                          ? `${employee.currentSalary.currency} ${Number(
                              employee
                                .currentSalary
                                .baseSalary,
                            ).toLocaleString()}`
                          : '—'}
                      </td>
  
                      <td>
                        <span
                          className={`status-badge ${
                            employee.status ===
                            'ACTIVE'
                              ? 'status-active'
                              : 'status-inactive'
                          }`}
                        >
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          )}
  
            <div className="pagination-actions">
                <button
                    disabled={
                    pagination.page <= 1 ||
                    loading
                    }
                    onClick={() =>
                    setPagination((prev) => ({
                        ...prev,
                        page: 1,
                    }))
                    }
                >
                    First
                </button>

                <button
                    disabled={
                    pagination.page <= 1 ||
                    loading
                    }
                    onClick={() =>
                    setPagination((prev) => ({
                        ...prev,
                        page: prev.page - 1,
                    }))
                    }
                >
                    Previous
                </button>

                <button
                    disabled={
                    pagination.page >=
                        pagination.totalPages ||
                    loading
                    }
                    onClick={() =>
                    setPagination((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                    }))
                    }
                >
                    Next
                </button>

                <button
                    disabled={
                    pagination.page >=
                        pagination.totalPages ||
                    loading
                    }
                    onClick={() =>
                    setPagination((prev) => ({
                        ...prev,
                        page: prev.totalPages,
                    }))
                    }
                >
                    Last
                </button>
            </div>
        </div>
      </div>
    );
  }
  
  export default Employees;