import type { ISuccess } from "./employee";

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
    employeeCount: number;
    rangeStart: string;
    rangeEnd: string;
}
  export interface ICompensationAnalytics {
    summary: ICompensationSummary[];
    byDepartment: ICompensationBreakdown[];
    byCountry: ICompensationBreakdown[];
    salaryDistribution: ISalaryDistribution[];
}
  
export interface ICompensationAnalyticsResponse extends ISuccess {
    success: boolean;
    data: ICompensationAnalytics;
}