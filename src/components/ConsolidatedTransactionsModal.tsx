import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Grid,
    Divider,
    Chip,
    IconButton,
    Tooltip
} from "@mui/material";
import {
    ExpandMore as ExpandMoreIcon,
    CalendarMonth as CalendarIcon,
    Bookmark as BookmarkIcon,
    Download as DownloadIcon,
    ContentCopy as CopyIcon
} from "@mui/icons-material";
import { type ConsolidatedTransactions } from "../types/transaction";
import { formatDate, formatCurrency, formatTimestamp, formatFileName, shortenUuid } from "../utils/formatters";
import { useDownloadReceipt } from "../hooks/useTransactions";

interface ConsolidatedTransactionsModalProps {
    open: boolean;
    onClose: () => void;
    consolidation: ConsolidatedTransactions;
}

export const ConsolidatedTransactionsModal = ({ open, onClose, consolidation }: ConsolidatedTransactionsModalProps) => {
    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h6">
                    {consolidation.title}
                </Typography>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {consolidation.transactions.map((transaction) => (
                        <Accordion key={transaction.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{ cursor: 'pointer' }}
                            >
                                <Box display="flex" justifyContent="space-between" width="100%" pr={2}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography>
                                            {shortenUuid(transaction.id)}
                                        </Typography>
                                        <Tooltip title="Copiar ID da transação">
                                            <IconButton
                                                size="small"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleCopyId(transaction.id);
                                                }}
                                            >
                                                <CopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <Typography color="text.secondary">
                                        {formatDate(transaction.date)}
                                    </Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box display="flex" flexDirection="column" gap={3}>
                                    <Box>
                                        <Typography variant="h6" component="div">
                                            {transaction.title}
                                        </Typography>
                                        <Chip
                                            label={transaction.type === "EXPENSE" ? "Despesa" : "Receita"}
                                            color={transaction.type === "EXPENSE" ? "error" : "success"}
                                            size="small"
                                            sx={{ mt: 1 }}
                                        />
                                    </Box>

                                    <Box>
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

                                    <Box>
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

                                    <Divider />

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

                                    {transaction.hasReceipt && (
                                        <Box display="flex" justifyContent="flex-end">
                                            <Button
                                                onClick={() => {
                                                    const { data: receipt } = useDownloadReceipt(transaction.id);
                                                    if (receipt) {
                                                        const url = URL.createObjectURL(receipt);
                                                        const a = document.createElement('a');
                                                        a.href = url;
                                                        a.download = `${formatFileName(transaction.title)}.pdf`;
                                                        a.click();
                                                    }
                                                }}
                                                color="primary"
                                                variant="contained"
                                                startIcon={<DownloadIcon />}
                                            >
                                                Comprovante
                                            </Button>
                                        </Box>
                                    )}
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Fechar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 