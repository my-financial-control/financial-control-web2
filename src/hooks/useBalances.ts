import { useQuery } from '@tanstack/react-query';
import { balancesApi } from '../services/balances';
import type { DateFilters } from '../types/common';

export const useCheckBalance = (filters: DateFilters) => {
    return useQuery({
        queryKey: ['checkBalance', filters],
        queryFn: () => balancesApi.checkBalance(filters),
    });
};
