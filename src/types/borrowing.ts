export type Parcel = {
    value: number;
    date: string;
};

export type ParcelCreate = {
    value: number;
};

export type Borrowing = {
    id: string;
    borrower: string;
    description: string;
    value: number;
    date: string;
    parcels: Parcel[];
    hasReceipt: boolean;
    timestamp: string;
};


export type BorrowingCreate = {
    borrower: string;
    description: string;
    value: number;
    date?: string;
}
