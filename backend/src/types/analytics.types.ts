export interface ICompensationSummary {
    currency: string;
    headcount: number;
    totalPayroll: string;
    averageSalary: string;
    medianSalary: string;
    minSalary: string;
    maxSalary: string;
}
  
export interface ICompensationBreakdown {
    name: string;
    currency: string;
    headcount: number;
    totalPayroll: string;
    averageSalary: string;
    medianSalary: string;
}
  
export interface ISalaryDistribution {
    currency: string;
    bucket: number;
    rangeStart: string;
    rangeEnd: string;
    employeeCount: number;
}
  
export interface ICompensationAnalyticsResponse {
    summary: ICompensationSummary[];
    byDepartment: ICompensationBreakdown[];
    byCountry: ICompensationBreakdown[];
    salaryDistribution: ISalaryDistribution[];
}

export interface ICompensationBreakdown {
    name: string;
    currency: string;
    headcount: number;
    totalPayroll: string;
    averageSalary: string;
    medianSalary: string;
}
