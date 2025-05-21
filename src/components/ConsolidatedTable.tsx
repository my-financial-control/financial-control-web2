import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel } from "@mui/material";
import { useState } from "react";
import { formatCurrency } from "../utils/formatters";
import type { ConsolidatedTransactions } from "../types/transaction";

export type Order = 'asc' | 'desc';

interface ConsolidatedTableProps {
    data: ConsolidatedTransactions[];
    order: Order;
    orderBy: keyof ConsolidatedTransactions;
    onRequestSort: (property: keyof ConsolidatedTransactions) => void;
}

export const ConsolidatedTable = ({ data, order, orderBy, onRequestSort }: ConsolidatedTableProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const createSortHandler = (property: keyof ConsolidatedTransactions) => () => {
        onRequestSort(property);
    };

    const sortedData = [...data].sort((a, b) => {
        const isAsc = order === 'asc';
        if (orderBy === 'total') {
            return isAsc ? a.total - b.total : b.total - a.total;
        }
        return isAsc
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
    });

    const paginatedData = sortedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <TableSortLabel
                                active={orderBy === 'title'}
                                direction={orderBy === 'title' ? order : 'asc'}
                                onClick={createSortHandler('title')}
                            >
                                Título
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="right">
                            <TableSortLabel
                                active={orderBy === 'total'}
                                direction={orderBy === 'total' ? order : 'asc'}
                                onClick={createSortHandler('total')}
                            >
                                Total
                            </TableSortLabel>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {paginatedData.map((row) => (
                        <TableRow key={row.title}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell align="right">{formatCurrency(row.total)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Itens por página:"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
            />
        </TableContainer>
    );
};
