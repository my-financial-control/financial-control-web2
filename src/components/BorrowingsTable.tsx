import { useState } from "react";
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Box,
    TablePagination,
} from "@mui/material";
import {
    Person as PersonIcon,
    AttachMoney as MoneyIcon,
    CalendarMonth as CalendarIcon,
    Description as DescriptionIcon,
} from "@mui/icons-material";
import type { Borrowing } from "../types/borrowing";
import { formatCurrency, formatDate } from '../utils/formatters';
import { BorrowingDetails } from "./BorrowingDetails";

type BorrowingsTableProps = {
    borrowings: Borrowing[];
};

export const BorrowingsTable = ({ borrowings }: BorrowingsTableProps) => {
    const [selectedBorrowing, setSelectedBorrowing] = useState<Borrowing | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (borrowing: Borrowing) => {
        setSelectedBorrowing(borrowing);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const paginatedBorrowings = borrowings.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box>
            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <PersonIcon fontSize="small" />
                                    <span>Emprestado para</span>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <DescriptionIcon fontSize="small" />
                                    <span>Descrição</span>
                                </Box>
                            </TableCell>
                            <TableCell align="left">
                                <Box display="flex" alignItems="center" justifyContent="flex-start" gap={0.5}>
                                    <MoneyIcon fontSize="small" />
                                    <span>Valor</span>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center" gap={0.5}>
                                    <CalendarIcon fontSize="small" />
                                    <span>Data</span>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedBorrowings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} sx={{ height: '96px', textAlign: 'center' }}>
                                    Nenhum empréstimo encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedBorrowings.map((borrowing) => (
                                <TableRow
                                    key={borrowing.id}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                    onClick={() => handleOpenModal(borrowing)}
                                >
                                    <TableCell>{borrowing.borrower}</TableCell>
                                    <TableCell>{borrowing.description}</TableCell>
                                    <TableCell
                                        align="left"
                                        sx={{
                                            fontWeight: 500,
                                            color: "warning.main"
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent="flex-start" gap={0.5}>
                                            <MoneyIcon fontSize="small" />
                                            <span>{formatCurrency(borrowing.value)}</span>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{formatDate(borrowing.date)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={borrowings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Itens por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </TableContainer>
            {selectedBorrowing && (
                <BorrowingDetails
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    borrowing={selectedBorrowing}
                />
            )}
        </Box>
    );
}; 