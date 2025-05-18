import { useMutation, useQuery } from '@tanstack/react-query';
import { transactionsApi, type FindAllTransactionsParams } from '../services/transactions';
import type { DateFilters } from '../types/common';
import type { TransactionCreate } from '../types/transaction';

export const useTransactions = (params?: FindAllTransactionsParams) => {
    return useQuery({
        queryKey: ['transactions', params],
        queryFn: () => transactionsApi.findAll(params),
    });
};

export const useCreateTransaction = () => {
    return useMutation({
        mutationFn: (data: { transaction: TransactionCreate; receipt?: File | null }) =>
            transactionsApi.create(data.transaction, data.receipt || undefined),
    });
};

export const useDownloadReceipt = (transactionId: string) => {
    return useQuery({
        queryKey: ['downloadReceipt', transactionId],
        queryFn: () => transactionsApi.downloadReceipt(transactionId),
    });
};

export const useCalculateTotals = (params?: DateFilters) => {
    return useQuery({
        queryKey: ['calculateTotals', params],
        queryFn: () => transactionsApi.calculateTotals(params),
    });
};
