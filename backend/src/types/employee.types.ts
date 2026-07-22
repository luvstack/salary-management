import type { IEmployeeSalary } from "./employee-salary.types";

export type SortOrder = 'ASC' | 'DESC';
export type SortBy = 'firstName' | 'lastName' | 'hireDate' | 'employeeCode';
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE';


export interface IEmployee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    jobTitle: string;
    country: string;
    hireDate: Date;
    status: EmployeeStatus;
    createdAt: Date;
    updatedAt: Date;
}

type EmployeeFilters = Partial<
  Pick<
    IEmployee,
    'country' | 'department' | 'status'
  >
>;

type SalaryFilters = {
    minSalary?: IEmployeeSalary['baseSalary'];
    maxSalary?: IEmployeeSalary['baseSalary'];
  };


export interface IEmployeesQuery extends EmployeeFilters, SalaryFilters {
  page?: number;
  limit?: number;
  search?: string;

  sortBy?: keyof Pick<
    IEmployee,
    | 'employeeCode'
    | 'firstName'
    | 'lastName'
    | 'hireDate'
  >;

  sortOrder?: SortOrder;
}

export interface ICurrentSalary
  extends Pick<
    IEmployeeSalary,
    'baseSalary' | 'currency' | 'effectiveFrom'
  > {}

export interface IEmployeeList
  extends Pick<
    IEmployee,
    | 'id'
    | 'employeeCode'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'department'
    | 'jobTitle'
    | 'country'
    | 'hireDate'
    | 'status'
  > {
  currentSalary: ICurrentSalary | null;
}

interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface IEmployeesResponse {
  data: IEmployeeList[];

  pagination: IPagination;
}


interface ISalaryHistory
  extends Pick<
    IEmployeeSalary,
    | 'id'
    | 'baseSalary'
    | 'currency'
    | 'effectiveFrom'
    | 'reason'
    | 'createdAt'
  > {}

export interface IEmployeeWithSalaryHistory
  extends IEmployee {
  salaryHistory: ISalaryHistory[];
}

export interface IGetEmployeeResponse
  extends Pick<
    IEmployee,
    | 'id'
    | 'employeeCode'
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'department'
    | 'jobTitle'
    | 'country'
    | 'hireDate'
    | 'status'
    | 'createdAt'
    | 'updatedAt'
  > {
  currentSalary: ICurrentSalary | null;
  salaryHistory: ISalaryHistory[];
}