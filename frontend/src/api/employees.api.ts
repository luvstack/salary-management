import axios from 'axios';

import { apiClient } from './client';

import type {IEmployeesResponse, IEmployeesQuery, IEmployeeDetailsResponse, IUpdateSalaryResponse, IUpdateSalaryPayload} from '../types/employee';

export async function getEmployees(params: IEmployeesQuery): Promise<IEmployeesResponse> {
  try {
    const response =
      await apiClient.get<IEmployeesResponse>(
        '/employees',
        {
          params,
        },
      );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch employees';
      throw new Error(message);
    }

    throw new Error(
      'Something went wrong while fetching employees',
    );
  }
}

export async function getEmployee(
  id: string,
): Promise<IEmployeeDetailsResponse> {
  try {
    const {data} = await apiClient.get<IEmployeeDetailsResponse>(`/employees/${id}`);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.response?.data?.message || 'Failed to fetch employee';
      throw new Error(message);
    }

    throw new Error(
      'Something went wrong while fetching employee',
    );
  }
}

export async function updateSalary(
  employeeId: string,
  payload: IUpdateSalaryPayload,
): Promise<IUpdateSalaryResponse> {
  try {
    const {data} = await apiClient.put<IUpdateSalaryResponse>(`/employees/${employeeId}/salary`, payload);

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || error.response?.data?.error || 'Failed to update salary';
      throw new Error(message);
    }

    throw new Error(
      'Something went wrong while updating salary',
    );
  }
}