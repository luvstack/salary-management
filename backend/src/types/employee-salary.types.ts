export interface IEmployeeSalary {
    id: string;
    employeeId: string;
    baseSalary: string;
    currency: string;
    effectiveFrom: Date;
    reason: string | null;
    createdAt: Date;
}

export interface IUpdateEmployeeSalary
  extends Pick<
    IEmployeeSalary,
     'currency' | 'effectiveFrom'
  > {
    baseSalary: number
    reason?: string
}