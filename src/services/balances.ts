import type { CheckBalance } from '../types/balance';
import type { DateFilters } from '../types/common';


export const balancesApi = {
    apiPath: '/api/v1/check-balance',

    checkBalance: async (filters: DateFilters): Promise<CheckBalance> => {
        const queryParams = new URLSearchParams();

        if (filters.month) {
            queryParams.append('month', filters.month.toString());
        }

        if (filters.year) {
            queryParams.append('year', filters.year.toString());
        }

        const response = await fetch(`${balancesApi.apiPath}?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to check balance');
        }

        return response.json();
    },

    checkBalancePlusRemainingPayments: async (filters: DateFilters): Promise<CheckBalance> => {
        const queryParams = new URLSearchParams();

        if (filters.month) {
            queryParams.append('month', filters.month.toString());
        }

        if (filters.year) {
            queryParams.append('year', filters.year.toString());
        }

        const response = await fetch(`${balancesApi.apiPath}/plus-remaining-payments?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to check balance plus remaining payments');
        }

        return response.json();
    }
};