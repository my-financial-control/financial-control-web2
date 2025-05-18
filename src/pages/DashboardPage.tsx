import { Container, Typography, Box, Paper, Skeleton, Fade } from "@mui/material";
import { useCheckBalance } from "../hooks/useBalances";
import { useCalculateTotals } from "../hooks/useTransactions";
import { formatCurrency } from "../utils/formatters";

const DashboardPage = () => {
    const { data: balance, isLoading: isBalanceLoading } = useCheckBalance({ month: 1, year: 2025 });
    const { data: totals, isLoading: isTotalsLoading } = useCalculateTotals({ month: 1, year: 2025 });

    const isLoading = isBalanceLoading || isTotalsLoading;

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h5" fontWeight="bold" color="text.primary">
                            Dashboard
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
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
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default DashboardPage;