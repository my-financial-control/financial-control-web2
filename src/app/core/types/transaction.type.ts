export type TransactionType = 'CREDIT' | 'DEBIT';

export type Month = 'JANUARY' | 'FEBRUARY' | 'MARCH' | 'APRIL' | 'MAY' | 'JUNE' | 'JULY' | 'AUGUST' | 'SEPTEMBER' | 'OCTOBER' | 'NOVEMBER' | 'DECEMBER';

export type Transaction = {
    id: string;
    title: string;
    description: string;
    value: number;
    type: TransactionType;
    currentMonth: Month;
    date: string;
    time: string;
};

export type TransactionCreate = {
    title: string;
    description: string;
    value: number;
    type: TransactionType;
    currentMonth: Month;
    date: Date;
};