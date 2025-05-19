import { type TransactionCategory } from '../types/category';

export const categoriesApi = {
    apiPath: '/api/v1/transactions/categories',

    findAll: async (): Promise<TransactionCategory[]> => {
        const response = await fetch(categoriesApi.apiPath);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return response.json();
    }
};
