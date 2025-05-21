import { Container, Typography, Box, Button, Skeleton, Fade, Select, MenuItem, FormControl, InputLabel, Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, TablePagination, TableSortLabel } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { useCalculateConsolidated } from "../hooks/useTransactions";
import { useCheckBalance, useCheckBalancePlusRemainingPayments } from "../hooks/useBalances";
import { useCalculateTotals } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/formatters";
import { months } from "../utils/data";
import { NewTransaction } from "../components/NewTransaction";
import type { ConsolidatedTransactions } from "../types/transaction";
import type { TransactionType } from "../types/common";
import { ConsolidatedTable, type Order } from "../components/ConsolidatedTable";

const ConsolidatedPage = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedType, setSelectedType] = useState<TransactionType>('EXPENSE');
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [order, setOrder] = useState<Order>('desc');
    const [orderBy, setOrderBy] = useState<keyof ConsolidatedTransactions>('total');

    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const { data: consolidatedData, isLoading: isConsolidatedLoading } = useCalculateConsolidated({
        month: selectedMonth,
        year: selectedYear,
        type: selectedType
    });

    const { data: balance, isLoading: isBalanceLoading } = useCheckBalance({ month: selectedMonth, year: selectedYear });
    const { data: balancePlusRemaining, isLoading: isBalancePlusRemainingLoading } = useCheckBalancePlusRemainingPayments({ month: selectedMonth, year: selectedYear });
    const { data: totals, isLoading: isTotalsLoading } = useCalculateTotals({ month: selectedMonth, year: selectedYear });

    const isLoading = isConsolidatedLoading || isBalanceLoading || isBalancePlusRemainingLoading || isTotalsLoading;

    const handleRequestSort = (property: keyof ConsolidatedTransactions) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            Consolidação
                        </Typography>
                        <Box display="flex" gap={2}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="type-select-label">Tipo</InputLabel>
                                <Select
                                    labelId="type-select-label"
                                    id="type-select"
                                    value={selectedType}
                                    label="Tipo"
                                    onChange={(e) => setSelectedType(e.target.value as TransactionType)}
                                >
                                    <MenuItem value="CREDIT">Receitas</MenuItem>
                                    <MenuItem value="EXPENSE">Despesas</MenuItem>
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="month-select-label">Mês</InputLabel>
                                <Select
                                    labelId="month-select-label"
                                    id="month-select"
                                    value={selectedMonth}
                                    label="Mês"
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                >
                                    {months.map((month) => (
                                        <MenuItem key={month.value} value={month.value}>
                                            {month.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="year-select-label">Ano</InputLabel>
                                <Select
                                    labelId="year-select-label"
                                    id="year-select"
                                    value={selectedYear}
                                    label="Ano"
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setIsNewTransactionOpen(true)}
                            >
                                Nova Transação
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 3 }}>
                        {isLoading ? (
                            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Fade in={true} timeout={500}>
                                <Paper
                                    elevation={0}
                                    variant="outlined"
                                    sx={{ p: 3, borderRadius: 2, height: '100%' }}
                                >
                                    <Typography variant="h6" color="text.secondary" mb={1}>
                                        Receitas
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="success.main">
                                        {formatCurrency(totals?.credits ?? 0)}
                                    </Typography>
                                </Paper>
                            </Fade>
                        )}
                        {isLoading ? (
                            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Fade in={true} timeout={500}>
                                <Paper
                                    elevation={0}
                                    variant="outlined"
                                    sx={{ p: 3, borderRadius: 2, height: '100%' }}
                                >
                                    <Typography variant="h6" color="text.secondary" mb={1}>
                                        Despesas
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="error.main">
                                        {formatCurrency(totals?.expenses ?? 0)}
                                    </Typography>
                                </Paper>
                            </Fade>
                        )}
                        {isLoading ? (
                            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Fade in={true} timeout={500}>
                                <Paper
                                    elevation={0}
                                    variant="outlined"
                                    sx={{ p: 3, borderRadius: 2, height: '100%' }}
                                >
                                    <Typography variant="h6" color="text.secondary" mb={1}>
                                        Saldo Total
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {formatCurrency(balance?.balance ?? 0)}
                                    </Typography>
                                </Paper>
                            </Fade>
                        )}
                        {isLoading ? (
                            <Skeleton variant="rounded" height={160} sx={{ borderRadius: 2 }} />
                        ) : (
                            <Fade in={true} timeout={500}>
                                <Paper
                                    elevation={0}
                                    variant="outlined"
                                    sx={{ p: 3, borderRadius: 2, height: '100%' }}
                                >
                                    <Typography variant="h6" color="text.secondary" mb={1}>
                                        Saldo + Recebíveis
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {formatCurrency(balancePlusRemaining?.balance ?? 0)}
                                    </Typography>
                                </Paper>
                            </Fade>
                        )}
                    </Box>

                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            height={400}
                            sx={{
                                borderRadius: 1,
                                bgcolor: 'rgba(0, 0, 0, 0.08)'
                            }}
                        />
                    ) : (
                        <Fade in={true} timeout={500}>
                            <Box>
                                <ConsolidatedTable
                                    data={consolidatedData ? (Array.isArray(consolidatedData) ? consolidatedData : [consolidatedData]).filter((item): item is ConsolidatedTransactions => item !== undefined) : []}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                />
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Container>

            <NewTransaction
                open={isNewTransactionOpen}
                onClose={() => setIsNewTransactionOpen(false)}
            />
        </Box>
    );
};

export default ConsolidatedPage;
