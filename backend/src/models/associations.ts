import { EmployeeModel } from './employee.model';
import { EmployeeSalaryModel } from './employee-salary.model';

export function initAssociations(): void {
  EmployeeModel.hasMany(EmployeeSalaryModel, {
    foreignKey: 'employeeId',
    as: 'salaryHistory',
  });

  EmployeeSalaryModel.belongsTo(EmployeeModel, {
    foreignKey: 'employeeId',
    as: 'employee',
  });
}