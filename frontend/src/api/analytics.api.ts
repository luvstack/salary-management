import axios from 'axios';

import { apiClient } from './client';

import type {
  ICompensationAnalyticsResponse,
} from '../types/analytics';

export async function getCompensationAnalytics(): Promise<ICompensationAnalyticsResponse> {
  try {
    const {data} = await apiClient.get<ICompensationAnalyticsResponse>('/analytics/compensation');

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        'Failed to fetch compensation analytics';

      throw new Error(message);
    }

    throw new Error(
      'Something went wrong while fetching compensation analytics',
    );
  }
}