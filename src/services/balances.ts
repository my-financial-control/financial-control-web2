import type { CheckBalance } from '../types/balance';
import type { DateFilters } from '../types/common';
const API_PATH = '/api/v1';


export const balancesApi = {
    checkBalance: async (filters: DateFilters): Promise<CheckBalance> => {
        const queryParams = new URLSearchParams();

        if (filters.month) {
            queryParams.append('month', filters.month.toString());
        }

        if (filters.year) {
            queryParams.append('year', filters.year.toString());
        }

        const response = await fetch(`${API_PATH}/check-balance?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to check balance');
        }

        return response.json();
    },
};