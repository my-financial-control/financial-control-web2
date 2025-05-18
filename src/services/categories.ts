import { type TransactionCategory } from '../types/category';

const API_PATH = '/api/v1';

export const categoriesApi = {
    findAll: async (): Promise<TransactionCategory[]> => {
        const response = await fetch(`${API_PATH}/transactions/categories`);
        if (!response.ok) {
            throw new Error('Failed to fetch categories');
        }
        return response.json();
    }
};
