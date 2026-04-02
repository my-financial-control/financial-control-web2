import { Container, Typography, Box, Button, Skeleton, Fade } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { TransactionsTable } from "../components/TransactionsTable";
import { useTransactions } from "../hooks/useTransactions";
import { NewTransaction } from "../components/NewTransaction";
import type { Transaction } from "../types/transaction";

const TransactionsPage = () => {
    const { data: transactions, isLoading } = useTransactions();
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [duplicateSourceTransaction, setDuplicateSourceTransaction] = useState<Transaction | null>(null);

    const handleOpenNewTransaction = () => {
        setDuplicateSourceTransaction(null);
        setIsNewTransactionOpen(true);
    };

    const handleCreateFromExisting = (transaction: Transaction) => {
        setDuplicateSourceTransaction(transaction);
        setIsNewTransactionOpen(true);
    };

    const handleCloseNewTransaction = () => {
        setIsNewTransactionOpen(false);
        setDuplicateSourceTransaction(null);
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
                            Transações
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleOpenNewTransaction}
                        >
                            Nova Transação
                        </Button>
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
                                <TransactionsTable
                                    transactions={transactions ?? []}
                                    onCreateFromExisting={handleCreateFromExisting}
                                />
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Container>

            <NewTransaction
                open={isNewTransactionOpen}
                onClose={handleCloseNewTransaction}
                prefillFrom={duplicateSourceTransaction}
            />
        </Box>
    );
};

export default TransactionsPage;
