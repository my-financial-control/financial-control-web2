import { useState } from "react";
import {
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Tabs,
    Tab,
    Box,
    TablePagination,
} from "@mui/material";
import {
    List as ListIcon,
    ArrowUpward as ArrowUpIcon,
    ArrowDownward as ArrowDownIcon,
    CalendarMonth as CalendarIcon,
    AttachMoney as MoneyIcon
} from "@mui/icons-material";
import type { Transaction } from "../types/transaction";
import { formatCurrency, formatDate } from '../utils/formatters';
import { TransactionDetails } from "./TransactionDetails";

type TransactionsTableProps = {
    transactions: Transaction[];
};

export const TransactionsTable = ({ transactions }: TransactionsTableProps) => {
    const [activeTab, setActiveTab] = useState<string>("all");
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue);
        setPage(0);
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenModal = (transaction: Transaction) => {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const filteredTransactions = transactions.filter((transaction) => {
        if (activeTab === "all") return true;
        if (activeTab === "credit") return transaction.type === "CREDIT";
        if (activeTab === "expense") return transaction.type === "EXPENSE";
        return true;
    });

    const paginatedTransactions = filteredTransactions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box width="100%">
            <Tabs
                value={activeTab}
                onChange={handleTabChange}
                sx={{ mb: 3 }}
                variant="fullWidth"
            >
                <Tab
                    label={
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <ListIcon fontSize="small" />
                            <span>Todas</span>
                        </Box>
                    }
                    value="all"
                />
                <Tab
                    label={
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <ArrowUpIcon fontSize="small" sx={{ color: 'success.main' }} />
                            <span>Créditos</span>
                        </Box>
                    }
                    value="credit"
                />
                <Tab
                    label={
                        <Box display="flex" alignItems="center" gap={0.5}>
                            <ArrowDownIcon fontSize="small" sx={{ color: 'error.main' }} />
                            <span>Despesas</span>
                        </Box>
                    }
                    value="expense"
                />
            </Tabs>

            <TableContainer component={Paper} variant="outlined">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Título</TableCell>
                            <TableCell>Categoria</TableCell>
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
                        {paginatedTransactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} sx={{ height: '96px', textAlign: 'center' }}>
                                    Nenhuma transação encontrada.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedTransactions.map((transaction) => (
                                <TableRow
                                    key={transaction.id}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 0, 0, 0.04)'
                                        }
                                    }}
                                    onClick={() => handleOpenModal(transaction)}
                                >
                                    <TableCell>{transaction.title}</TableCell>
                                    <TableCell>{transaction.category ? transaction.category.name : "Sem categoria"}</TableCell>
                                    <TableCell
                                        align="left"
                                        sx={{
                                            fontWeight: 500,
                                            color: transaction.type === "EXPENSE" ? "error.main" : "success.main"
                                        }}
                                    >
                                        <Box display="flex" alignItems="center" justifyContent="flex-start" gap={0.5}>
                                            {transaction.type === "EXPENSE" ? (
                                                <ArrowDownIcon fontSize="small" />
                                            ) : (
                                                <ArrowUpIcon fontSize="small" />
                                            )}
                                            <span>{formatCurrency(transaction.value)}</span>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{formatDate(transaction.date)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredTransactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Itens por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </TableContainer>
            {selectedTransaction && (
                <TransactionDetails
                    open={isModalOpen}
                    onClose={handleCloseModal}
                    transaction={selectedTransaction}
                />
            )}
        </Box>
    );
};
