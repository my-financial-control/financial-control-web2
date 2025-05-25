import { useMutation, useQuery } from "@tanstack/react-query";
import { borrowingsApi } from "../services/borrowings";
import type { BorrowingCreate, Parcel } from "../types/borrowing";

export const useBorrowings = () => {
    return useQuery({
        queryKey: ['borrowings'],
        queryFn: borrowingsApi.findAll,
    });
}

export const useCreateBorrowing = () => {
    return useMutation({
        mutationFn: (data: { borrowing: BorrowingCreate; receipt?: File | null }) =>
            borrowingsApi.create(data.borrowing, data.receipt || undefined),
    });
}

export const usePayParcel = (id: string, parcel: Parcel) => {
    return useMutation({
        mutationFn: () => borrowingsApi.payParcel(id, parcel),
    });
}

export const useDownloadReceipt = (borrowingId: string) => {
    return useQuery({
        queryKey: ['downloadReceipt', borrowingId],
        queryFn: () => borrowingsApi.downloadReceipt(borrowingId),
    });
}
