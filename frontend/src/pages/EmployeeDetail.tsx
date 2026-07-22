import {useEffect, useState} from 'react';
  
import {useNavigate, useParams} from 'react-router-dom';
import {getEmployee, updateSalary} from '../api/employees.api';
import type {IEmployeeDetails} from '../types/employee';
  
function EmployeeDetails() {
    const { id } = useParams();
  
    const navigate = useNavigate();
  
    const [employee, setEmployee] =
      useState<IEmployeeDetails | null>(
        null,
      );
  
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const [showSalaryForm, setShowSalaryForm] = useState(false);

    const [salaryForm, setSalaryForm] = useState({
        baseSalary: '',
        currency: '',
        effectiveFrom: '',
        reason: '',
    });

    const [savingSalary, setSavingSalary] = useState(false);
    const [salaryError, setSalaryError] = useState('');
    const [salarySuccess, setSalarySuccess] = useState('');

    async function loadEmployee() {
        if (!id) {
          setError(
            'Employee ID is missing',
          );
      
          setLoading(false);
      
          return;
        }
      
        try {
          setLoading(true);
          setError('');
      
          const {data} = await getEmployee(id);
    
          setEmployee(data);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load employee',
          );
        } finally {
          setLoading(false);
        }
    }

    async function handleSalarySubmit(
        event: React.SubmitEvent<HTMLFormElement>,
      ) {
        event.preventDefault();
      
        if (!id) {
          return;
        }
      
        try {
          setSavingSalary(true);
          setSalaryError('');
          setSalarySuccess('');

          const {baseSalary,  currency, effectiveFrom, reason} = salaryForm;
      
          await updateSalary(id, {
            baseSalary: Number(baseSalary),
            currency,
            effectiveFrom,
            reason:reason.trim() || undefined,
          });
      
          setSalarySuccess('Salary updated successfully.');
      
          setSalaryForm({
            baseSalary: '',
            currency: '',
            effectiveFrom: '',
            reason: '',
          });
      
          await loadEmployee();
      
          setShowSalaryForm(false);
        } catch (error) {
          setSalaryError(
            error instanceof Error
              ? error.message
              : 'Failed to update salary',
          );
        } finally {
          setSavingSalary(false);
        }
    }


  
    useEffect(() => {
      void loadEmployee();
    }, [id]);
  
    if (loading) {
      return (
        <div className="page-message">
          Loading employee...
        </div>
      );
    }
  
    if (
      error ||
      !employee
    ) {
      return (
        <div>
          <button
            className="back-button"
            onClick={() =>
              navigate('/employees')
            }
          >
            ← Back to Employees
          </button>
  
          <div className="error-message">
            {error ||
              'Employee not found'}
          </div>
        </div>
      );
    }
  
    return (
      <div className="employee-details-page">
  
        {/* HEADER */}
  
        <button
          className="back-button"
          onClick={() =>
            navigate('/employees')
          }
        >
          ← Back to Employees
        </button>
  
        <div className="details-header">
          <div>
            <h1>
              {employee.firstName}{' '}
              {employee.lastName}
            </h1>
  
            <p>
              {employee.employeeCode}
            </p>
          </div>
  
          <span
            className={`status-badge ${
              employee.status === 'ACTIVE'
                ? 'status-active'
                : 'status-inactive'
            }`}
          >
            {employee.status}
          </span>
        </div>
  
        {/* EMPLOYEE INFORMATION */}
  
        <div className="details-card">
          <h2>
            Employee Information
          </h2>
  
          <div className="details-grid">
            <DetailItem
              label="Email"
              value={employee.email}
            />
  
            <DetailItem
              label="Department"
              value={
                employee.department
              }
            />
  
            <DetailItem
              label="Job Title"
              value={
                employee.jobTitle
              }
            />
  
            <DetailItem
              label="Country"
              value={employee.country}
            />
  
            <DetailItem
              label="Hire Date"
              value={
                employee.hireDate
              }
            />
  
            <DetailItem
              label="Employee ID"
              value={
                employee.employeeCode
              }
            />
          </div>
        </div>
  
        {/* CURRENT COMPENSATION */}
  
        <div className="details-card">

            <div className="card-header">
                <h2>
                    Current Compensation
                </h2>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        setShowSalaryForm(
                            (current) => !current,
                        );

                        setSalaryError('');
                        setSalarySuccess('');
                    }}
                >
                    {showSalaryForm ? 'Cancel' : 'Update Salary'}
                </button>
            </div>
  
          {employee.currentSalary ? (
            <div className="current-salary">
              <div>
                <span className="salary-label">
                  Base Salary
                </span>
  
                <strong>
                  {
                    employee
                      .currentSalary
                      .currency
                  }{' '}
                  {Number(
                    employee
                      .currentSalary
                      .baseSalary,
                  ).toLocaleString()}
                </strong>
              </div>
  
              <div>
                <span className="salary-label">
                  Effective From
                </span>
  
                <strong>
                  {
                    employee
                      .currentSalary
                      .effectiveFrom
                  }
                </strong>
              </div>
            </div>
          ) : (
            <p>
              No current salary
              available.
            </p>
          )}
        </div>



        {salarySuccess && (
            <div className="success-message">
                {salarySuccess}
            </div>
        )}


        {showSalaryForm && (
            <form
                className="salary-form"
                onSubmit={handleSalarySubmit}
            >
                <div className="form-grid">
                <div className="form-field">
                    <label>Base Salary</label>

                    <input
                    type="number"
                    min="0"
                    required
                    value={salaryForm.baseSalary}
                    onChange={(event) =>
                        setSalaryForm((prev) => ({
                        ...prev,
                        baseSalary:
                            event.target.value,
                        }))
                    }
                    placeholder="e.g. 1500000"
                    />
                </div>

                <div className="form-field">
                    <label>Currency</label>

                    <select
                    required
                    value={salaryForm.currency}
                    onChange={(event) =>
                        setSalaryForm((prev) => ({
                        ...prev,
                        currency:
                            event.target.value,
                        }))
                    }
                    >
                    <option value="">
                        Select currency
                    </option>
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    <option value="GBP">GBP</option>
                    <option value="EUR">EUR</option>
                    <option value="CAD">CAD</option>
                    <option value="AUD">AUD</option>
                    <option value="JPY">JPY</option>
                    <option value="SGD">SGD</option>
                    </select>
                </div>

                <div className="form-field">
                    <label>Effective From</label>

                    <input
                    type="date"
                    required
                    value={salaryForm.effectiveFrom}
                    onChange={(event) =>
                        setSalaryForm((prev) => ({
                        ...prev,
                        effectiveFrom:
                            event.target.value,
                        }))
                    }
                    />
                </div>

                <div className="form-field">
                    <label>Reason</label>

                    <input
                    type="text"
                    value={salaryForm.reason}
                    onChange={(event) =>
                        setSalaryForm((prev) => ({
                        ...prev,
                        reason:
                            event.target.value,
                        }))
                    }
                    placeholder="e.g. Annual review"
                    />
                </div>
                </div>

                {salaryError && (
                <div className="error-message">
                    {salaryError}
                </div>
                )}

                <button
                type="submit"
                className="primary-button"
                disabled={savingSalary}
                >
                {savingSalary
                    ? 'Saving...'
                    : 'Save Salary'}
                </button>
            </form>
        )}


  
        {/* SALARY HISTORY */}
  
        <div className="details-card">
          <h2>
            Salary History
          </h2>
  
          {employee.salaryHistory
            .length === 0 ? (
            <p>
              No salary history
              available.
            </p>
          ) : (
            <div className="salary-table-wrapper">
              <table className="employee-table">
                <thead>
                  <tr>
                    <th>
                      Effective Date
                    </th>
  
                    <th>
                      Base Salary
                    </th>
  
                    <th>
                      Currency
                    </th>
  
                    <th>Reason</th>
                  </tr>
                </thead>
  
                <tbody>
                  {employee.salaryHistory.map(
                    (salary) => (
                      <tr
                        key={
                          salary.id
                        }
                      >
                        <td>
                          {
                            salary.effectiveFrom
                          }
                        </td>
  
                        <td>
                          {Number(
                            salary.baseSalary,
                          ).toLocaleString()}
                        </td>
  
                        <td>
                          {
                            salary.currency
                          }
                        </td>
  
                        <td>
                          {salary.reason ||
                            '—'}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  interface DetailItemProps {
    label: string;
    value: string;
  }
  
  function DetailItem({
    label,
    value,
  }: DetailItemProps) {
    return (
      <div className="detail-item">
        <span>{label}</span>
  
        <strong>{value}</strong>
      </div>
    );
  }
  
  export default EmployeeDetails;