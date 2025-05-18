import { type TransactionType } from "./common";

export type TransactionCategory = {
    id: string;
    name: string;
    description: string;
    type: TransactionType;
}
