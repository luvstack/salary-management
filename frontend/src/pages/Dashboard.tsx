import {
    useEffect,
    useState,
  } from 'react';
  
import {getCompensationAnalytics} from '../api/analytics.api';
  
import type {ICompensationAnalytics} from '../types/analytics';
  
function Dashboard() {
    const [analytics, setAnalytics] =
      useState<ICompensationAnalytics | null>(
        null,
      );
  
    const [loading, setLoading] =
      useState(true);
  
    const [error, setError] =
      useState('');
  
    useEffect(() => {
      async function loadAnalytics() {
        try {
          setLoading(true);
          setError('');
  
          const response =
            await getCompensationAnalytics();
  
          setAnalytics(response.data);
        } catch (error) {
          setError(
            error instanceof Error
              ? error.message
              : 'Failed to load analytics',
          );
        } finally {
          setLoading(false);
        }
      }
  
      void loadAnalytics();
    }, []);
  
    if (loading) {
      return (
        <div className="page-message">
          Loading compensation analytics...
        </div>
      );
    }
  
    if (error || !analytics) {
      return (
        <div className="error-message">
          {error ||
            'Analytics unavailable'}
        </div>
      );
    }
  
    return (
      <div className="analytics-page">
        <div className="page-header">
          <div>
            <h1>
              Compensation Analytics
            </h1>
  
            <p>
              Understand how ACME pays
              employees across the
              organization
            </p>
          </div>
        </div>
  
        <div className="details-card">
          <h2>
            Compensation Summary
          </h2>
  
          <div className="analytics-table-wrapper">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Headcount</th>
                  <th>Total Payroll</th>
                  <th>Average Salary</th>
                  <th>Median Salary</th>
                  <th>Min Salary</th>
                  <th>Max Salary</th>
                </tr>
              </thead>
  
              <tbody>
                {analytics.summary.map(
                  (item) => (
                    <tr
                      key={item.currency}
                    >
                      <td>
                        <strong>
                          {item.currency}
                        </strong>
                      </td>
  
                      <td>
                        {item.headcount.toLocaleString()}
                      </td>
  
                      <td>
                        {formatMoney(
                          item.totalPayroll,
                        )}
                      </td>
  
                      <td>
                        {formatMoney(
                          item.averageSalary,
                        )}
                      </td>
  
                      <td>
                        {formatMoney(
                          item.medianSalary,
                        )}
                      </td>
  
                      <td>
                        {formatMoney(
                          item.minSalary,
                        )}
                      </td>
  
                      <td>
                        {formatMoney(
                          item.maxSalary,
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>



          




          <div className="details-card">
                <h2>
                    Compensation by Department
                </h2>

                <div className="analytics-table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                            <th>Department</th>
                            <th>Currency</th>
                            <th>Headcount</th>
                            <th>Total Payroll</th>
                            <th>Average Salary</th>
                            <th>Median Salary</th>
                            </tr>
                        </thead>

                        <tbody>
                            {analytics.byDepartment.map(
                            (item) => (
                                <tr
                                key={`${item.name}-${item.currency}`}
                                >
                                <td>
                                    <strong>
                                    {item.name}
                                    </strong>
                                </td>

                                <td>
                                    {item.currency}
                                </td>

                                <td>
                                    {item.headcount.toLocaleString()}
                                </td>

                                <td>
                                    {formatMoney(
                                    item.totalPayroll,
                                    )}
                                </td>

                                <td>
                                    {formatMoney(
                                    item.averageSalary,
                                    )}
                                </td>

                                <td>
                                    {formatMoney(
                                    item.medianSalary,
                                    )}
                                </td>
                                </tr>
                            ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            <div className="details-card">
                <h2>
                    Compensation by Country
                </h2>

                <div className="analytics-table-wrapper">
                    <table className="employee-table">
                        <thead>
                            <tr>
                            <th>Country</th>
                            <th>Currency</th>
                            <th>Headcount</th>
                            <th>Total Payroll</th>
                            <th>Average Salary</th>
                            <th>Median Salary</th>
                            </tr>
                        </thead>

                        <tbody>
                            {analytics.byCountry.map(
                            (item) => (
                                <tr
                                key={`${item.name}-${item.currency}`}
                                >
                                <td>
                                    <strong>
                                    {item.name}
                                    </strong>
                                </td>

                                <td>
                                    {item.currency}
                                </td>

                                <td>
                                    {item.headcount.toLocaleString()}
                                </td>

                                <td>
                                    {formatMoney(
                                    item.totalPayroll,
                                    )}
                                </td>

                                <td>
                                    {formatMoney(
                                    item.averageSalary,
                                    )}
                                </td>

                                <td>
                                    {formatMoney(
                                    item.medianSalary,
                                    )}
                                </td>
                                </tr>
                            ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>










            <div className="details-card">
                <h2>Salary Distribution</h2>

                <p className="section-description">
                    Distribution of employees across salary ranges by currency
                </p>

                <div className="distribution-grid">
                    {analytics.summary.map((summary) => {
                    const distribution =
                        analytics.salaryDistribution.filter(
                        (item) =>
                            item.currency ===
                            summary.currency,
                        );

                    const maxCount = Math.max(
                        ...distribution.map(
                        (item) =>
                            item.employeeCount,
                        ),
                        1,
                    );

                    return (
                        <div
                        className="distribution-card"
                        key={summary.currency}
                        >
                        <div className="distribution-header">
                            <strong>
                            {summary.currency}
                            </strong>

                            <span>
                            {summary.headcount.toLocaleString()}{' '}
                            employees
                            </span>
                        </div>

                        <div className="distribution-bars">
                            {distribution.map(
                            (item) => {
                                const width =
                                (item.employeeCount /
                                    maxCount) *
                                100;

                                return (
                                <div
                                    className="distribution-row"
                                    key={`${item.currency}-${item.bucket}`}
                                >
                                    <div className="distribution-range">
                                    {formatMoney(
                                        item.rangeStart,
                                    )}
                                    {' – '}
                                    {formatMoney(
                                        item.rangeEnd,
                                    )}
                                    </div>

                                    <div className="distribution-bar-track">
                                    <div
                                        className="distribution-bar"
                                        style={{
                                        width: `${width}%`,
                                        }}
                                    />
                                    </div>

                                    <div className="distribution-count">
                                    {
                                        item.employeeCount
                                    }
                                    </div>
                                </div>
                                );
                            },
                            )}
                        </div>
                        </div>
                    );
                    })}
                </div>
            </div>












        </div>
      </div>
    );
}
  
function formatMoney(value: string) {
    return Number(
      value,
    ).toLocaleString();
}
  
export default Dashboard;