import type { Borrowing, BorrowingCreate, Parcel } from "../types/borrowing";

export const borrowingsApi = {
    apiPath: '/api/v1/borrowings',

    findAll: async (): Promise<Borrowing[]> => {
        const response = await fetch(`${borrowingsApi.apiPath}`);

        if (!response.ok) {
            throw new Error('Failed to fetch borrowings');
        }

        return response.json();
    },

    create: async (borrowing: BorrowingCreate, receipt?: File): Promise<Borrowing> => {
        const formData = new FormData();
        formData.append('borrowing', JSON.stringify(borrowing));

        if (receipt) {
            formData.append('receipt', receipt);
        }

        const response = await fetch(`${borrowingsApi.apiPath}`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Failed to create borrowing');
        }

        return response.json();
    },

    payParcel: async (id: string, parcel: Parcel): Promise<void> => {
        const response = await fetch(`${borrowingsApi.apiPath}/${id}/parcels`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(parcel),
        });

        if (!response.ok) {
            throw new Error('Failed to pay parcel');
        }
    },

    downloadReceipt: async (borrowingId: string): Promise<Blob> => {
        const response = await fetch(`${borrowingsApi.apiPath}/${borrowingId}/receipt`);

        if (!response.ok) {
            throw new Error('Failed to download receipt');
        }

        return response.blob();
    }
}