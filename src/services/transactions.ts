import type { Transaction, TransactionCreate, CalculateTotals } from '../types/transaction';
import type { DateFilters, TransactionType } from '../types/common';

const API_PATH = '/api/v1';

export type FindAllTransactionsParams = {
    type?: TransactionType;
    month?: number;
    year?: number;
}

export const transactionsApi = {
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

        const response = await fetch(`${API_PATH}/transactions?${queryParams.toString()}`);

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

        const response = await fetch(`${API_PATH}/transactions`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create transaction');
        }

        return response.json();
    },

    downloadReceipt: async (transactionId: string): Promise<Blob> => {
        const response = await fetch(`${API_PATH}/transactions/${transactionId}/receipt`);

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

        const response = await fetch(`${API_PATH}/transactions/totals?${queryParams.toString()}`);

        if (!response.ok) {
            throw new Error('Failed to calculate totals');
        }

        return response.json();
    }
};
