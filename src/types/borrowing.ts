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
    value: number;
    date: string;
    parcels: Parcel[];
};


export type BorrowingCreate = {
    borrower: string;
    value: number;
    date?: string;
}
