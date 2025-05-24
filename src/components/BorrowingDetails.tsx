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
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import {
    Person as PersonIcon,
    CalendarMonth as CalendarIcon,
    AttachMoney as MoneyIcon,
    Close as CloseIcon,
} from "@mui/icons-material";
import { type Borrowing } from "../types/borrowing";
import { formatCurrency, formatDate } from "../utils/formatters";

interface BorrowingDetailsProps {
    open: boolean;
    onClose: () => void;
    borrowing: Borrowing;
}

export const BorrowingDetails = ({ open, onClose, borrowing }: BorrowingDetailsProps) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">
                        Detalhes do Empréstimo
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Grid container spacing={2}>
                        <Grid>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Emprestado para
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <PersonIcon color="action" />
                                    <Typography>{borrowing.borrower}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Valor Total
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <MoneyIcon color="warning" />
                                    <Typography color="warning.main" fontWeight="medium">
                                        {formatCurrency(borrowing.value)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        <Grid>
                            <Box display="flex" flexDirection="column" gap={1}>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Data do Empréstimo
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <CalendarIcon color="action" />
                                    <Typography>{formatDate(borrowing.date)}</Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>

                    <Divider />

                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Parcelas
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Valor</TableCell>
                                        <TableCell>Data de Pagamento</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {borrowing.parcels.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={2} sx={{ textAlign: 'center' }}>
                                                Nenhuma parcela registrada
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        borrowing.parcels.map((parcel, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <MoneyIcon fontSize="small" color="success" />
                                                        <Typography color="success.main">
                                                            {formatCurrency(parcel.value)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        <CalendarIcon fontSize="small" color="action" />
                                                        <Typography>
                                                            {formatDate(parcel.date)}
                                                        </Typography>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Fechar</Button>
            </DialogActions>
        </Dialog>
    );
}; 