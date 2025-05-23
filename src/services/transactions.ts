import type { Transaction, TransactionCreate, CalculateTotals, ConsolidatedTransactions } from '../types/transaction';
import type { DateFilters, TransactionType, ConsolidatedFilters } from '../types/common';

export type FindAllTransactionsParams = {
    type?: TransactionType;
    month?: number;
    year?: number;
}

export const transactionsApi = {
    apiPath: '/api/v1/transactions',

    findAll: async (params?: FindAllTransactionsParams): Promise<Transaction[]> => {
        const queryParams = new URLSearchParams();

        if (params?.type) {
            queryParams.append('type', params.type);
        }

        if (params?.month) {
            queryParams.append('month', params.month.toString());
        }

        if (params?.year) {
            queryParams.append('year', params.year.toString());
        }

        const response = await fetch(`${transactionsApi.apiPath}?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        return response.json();
    },

    create: async (transaction: TransactionCreate, receipt?: File): Promise<Transaction> => {
        const formData = new FormData();
        formData.append('transaction', JSON.stringify({ ...transaction, date: transaction.date.toISOString() }));

        if (receipt) {
            formData.append('receipt', receipt);
        }

        const response = await fetch(`${transactionsApi.apiPath}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create transaction');
        }

        return response.json();
    },

    downloadReceipt: async (transactionId: string): Promise<Blob> => {
        const response = await fetch(`${transactionsApi.apiPath}/${transactionId}/receipt`);

        if (!response.ok) {
            throw new Error('Failed to download receipt');
        }

        return response.blob();
    },

    calculateTotals: async (params?: DateFilters): Promise<CalculateTotals> => {
        const queryParams = new URLSearchParams();

        if (params?.month) {
            queryParams.append('month', params.month.toString());
        }

        if (params?.year) {
            queryParams.append('year', params.year.toString());
        }

        const response = await fetch(`${transactionsApi.apiPath}/totals?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to calculate totals');
        }

        return response.json();
    },

    calculateConsolidated: async (params: ConsolidatedFilters): Promise<ConsolidatedTransactions> => {
        const queryParams = new URLSearchParams();

        queryParams.append('month', params.month.toString());
        queryParams.append('year', params.year.toString());
        queryParams.append('type', params.type);

        const response = await fetch(`${transactionsApi.apiPath}/consolidated?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to calculate consolidated');
        }

        return response.json();
    }
};
