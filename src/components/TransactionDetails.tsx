import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    Grid,
    Divider,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    CalendarMonth as CalendarIcon,
    Bookmark as BookmarkIcon,
    Download as DownloadIcon,
    Close as CloseIcon,
    ContentCopy as CopyIcon
} from "@mui/icons-material";
import { type Transaction } from "../types/transaction";
import { formatCurrency, formatDate, formatTimestamp, formatFileName } from "../utils/formatters";
import { useDownloadReceipt } from "../hooks/useTransactions";

interface TransactionDetailProps {
    open: boolean;
    onClose: () => void;
    transaction: Transaction;
}

export const TransactionDetails = ({ open, onClose, transaction }: TransactionDetailProps) => {
    const { data: receipt } = useDownloadReceipt(transaction.id);

    const handleDownloadReceipt = () => {
        if (receipt) {
            const url = URL.createObjectURL(receipt);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${formatFileName(transaction.title)}.pdf`;
            a.click();
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(transaction.id);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" component="div">
                            {transaction.title}
                        </Typography>
                        <Tooltip title="Copiar ID da transação">
                            <IconButton
                                size="small"
                                onClick={handleCopyId}
                                sx={{ ml: 1 }}
                            >
                                <CopyIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Chip
                        label={transaction.type === "EXPENSE" ? "Despesa" : "Receita"}
                        color={transaction.type === "EXPENSE" ? "error" : "success"}
                        size="medium"
                    />
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box mb={3}>
                    {transaction.description ? (
                        <Typography variant="body2" color="text.secondary">
                            {transaction.description}
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Sem descrição
                        </Typography>
                    )}
                </Box>

                <Box mb={3}>
                    <Typography variant="h4"
                        sx={{
                            fontWeight: 'bold',
                            color: transaction.type === "EXPENSE" ? "error.main" : "success.main"
                        }}
                    >
                        {transaction.type === "EXPENSE" ? "- " : "+ "}
                        {formatCurrency(transaction.value)}
                    </Typography>
                </Box>

                <Divider sx={{ my: 2 }} />

                <Grid container sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Box display="flex" gap={1} alignItems="center" mb={1}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Data
                            </Typography>
                        </Box>
                        <Typography variant="body1" align="center">
                            {formatDate(transaction.date)}
                        </Typography>
                    </Grid>

                    <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Box display="flex" gap={1} alignItems="center" mb={1}>
                            <BookmarkIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Categoria
                            </Typography>
                        </Box>
                        <Typography variant="body1" align="center">
                            {transaction.category ? transaction.category.name : "Sem categoria"}
                        </Typography>
                    </Grid>

                    <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <Box display="flex" gap={1} alignItems="center" mb={1}>
                            <CalendarIcon fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                                Hora do Registro
                            </Typography>
                        </Box>
                        <Typography variant="body1" align="center">
                            {formatTimestamp(transaction.timestamp)}h
                        </Typography>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={onClose}
                    color="inherit"
                    startIcon={<CloseIcon />}
                >
                    Fechar
                </Button>

                {transaction.hasReceipt && (
                    <Button
                        onClick={handleDownloadReceipt}
                        color="primary"
                        variant="contained"
                        startIcon={<DownloadIcon />}
                    >
                        Comprovante
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};