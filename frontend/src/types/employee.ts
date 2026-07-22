export interface ICurrentSalary {
    baseSalary: string;
    currency: string;
    effectiveFrom: string;
}
  
export interface IEmployee {
    id: string;
    employeeCode: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
    jobTitle: string;
    country: string;
    hireDate: string;
    status: 'ACTIVE' | 'INACTIVE';
    currentSalary: ICurrentSalary | null;
}

interface IPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}
  
export interface IEmployeeData {
    data: IEmployee[];
    pagination: IPagination;
}

interface ISuccess {
    success: boolean
}

export interface IEmployeesResponse extends ISuccess{
    data: IEmployeeData;
}

type SortBy = 'employeeCode' | 'firstName' | 'lastName' | 'hireDate';
export type Status = 'ACTIVE' | 'INACTIVE';
type SortOrder = 'ASC' | 'DESC';

export interface IEmployeesQuery {
    page?: number;
    limit?: number;
    search?: string;
    country?: string;
    department?: string;
    status?: Status;
    minSalary?: number;
    maxSalary?: number;
    sortBy?: SortBy;
    sortOrder?: SortOrder;
}

export interface IEmployeeSalary {
    id: string;
    baseSalary: string;
    currency: string;
    effectiveFrom: string;
    reason: string | null;
    createdAt: string;
}
  
export interface IEmployeeDetails
    extends IEmployee {
    createdAt: string;
    updatedAt: string;
    salaryHistory: IEmployeeSalary[];
}
  
export interface IEmployeeDetailsResponse extends ISuccess {
    data: IEmployeeDetails;
}

export interface IUpdateSalaryPayload {
    baseSalary: number;
    currency: string;
    effectiveFrom: string;
    reason?: string;
}
  
export interface IUpdateSalaryResponse extends ISuccess {
    data: IEmployeeSalary;
}