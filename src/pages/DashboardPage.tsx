import { Container, Typography, Box, Paper, Skeleton, Fade, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useCheckBalance, useCheckBalancePlusRemainingPayments } from "../hooks/useBalances";
import { useCalculateTotals } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/formatters";
import { useState } from "react";
import { months } from "../utils/data";
import { ExpensesByCategoryChart } from "../components/ExpensesByCategoryChart";

const DashboardPage = () => {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    
    const { data: balance, isLoading: isBalanceLoading } = useCheckBalance({ month: selectedMonth, year: selectedYear });
    const { data: balancePlusRemaining, isLoading: isBalancePlusRemainingLoading } = useCheckBalancePlusRemainingPayments({ month: selectedMonth, year: selectedYear });
    const { data: totals, isLoading: isTotalsLoading } = useCalculateTotals({ month: selectedMonth, year: selectedYear });

    const isLoading = isBalanceLoading || isTotalsLoading || isBalancePlusRemainingLoading;

    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                            Dashboard
                        </Typography>
                        <Box display="flex" gap={2}>
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

                    <Box sx={{ mt: 3 }}>
                        <ExpensesByCategoryChart filters={{ month: selectedMonth, year: selectedYear }} />
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardPage;