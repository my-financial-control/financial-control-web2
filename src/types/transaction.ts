import { type TransactionType } from "./common";
import { type TransactionCategory } from "./category";

export type Month =
    | 'JANUARY'
    | 'FEBRUARY'
    | 'MARCH'
    | 'APRIL'
    | 'MAY'
    | 'JUNE'
    | 'JULY'
    | 'AUGUST'
    | 'SEPTEMBER'
    | 'OCTOBER'
    | 'NOVEMBER'
    | 'DECEMBER';


export type Transaction = {
    id: string;
    title: string;
    description?: string;
    value: number;
    type: TransactionType;
    currentMonth: Month;
    currentYear: number;
    date: string;
    timestamp: string;
    category?: TransactionCategory;
    hasReceipt: boolean;
}

export type CalculateTotals = {
    credits: number;
    expenses: number;
}

export type TransactionCreate = {
    title: string;
    description: string;
    value: number;
    type: TransactionType;
    currentMonth: number;
    currentYear: number;
    date: Date;
    categoryId?: string;
};

export type ConsolidatedTransactions = {
    title: string;
    total: number;
    transactions: Transaction[];
}
