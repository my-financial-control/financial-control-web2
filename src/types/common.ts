export type TransactionType = 'EXPENSE' | 'CREDIT';

export type DateFilters = {
    month?: number;
    year?: number;
}

export type ConsolidatedFilters = {
    month: number;
    year: number;
    type: TransactionType;
}