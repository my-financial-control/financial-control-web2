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
    Add as AddIcon,
    Download as DownloadIcon,
} from "@mui/icons-material";
import { type Borrowing } from "../types/borrowing";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useState } from "react";
import { ParcelRegistrationModal } from "./ParcelRegistrationModal";
import { useMutation } from "@tanstack/react-query";
import { borrowingsApi } from "../services/borrowings";

interface BorrowingDetailsProps {
    open: boolean;
    onClose: () => void;
    borrowing: Borrowing;
}

export const BorrowingDetails = ({ open, onClose, borrowing }: BorrowingDetailsProps) => {
    const [isParcelModalOpen, setIsParcelModalOpen] = useState(false);

    const totalPaid = borrowing.parcels.reduce((sum, parcel) => sum + parcel.value, 0);
    const remainingValue = borrowing.value - totalPaid;

    const { mutate: downloadReceipt, isPending } = useMutation({
        mutationFn: () => borrowingsApi.downloadReceipt(borrowing.id),
        onSuccess: (receipt) => {
            const url = URL.createObjectURL(receipt);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${borrowing.borrower}-${borrowing.id}.pdf`;
            a.click();
        }
    });

    return (
        <>
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
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="h6">
                                    Parcelas
                                </Typography>
                                {remainingValue > 0 && (
                                    <Button
                                        startIcon={<AddIcon />}
                                        variant="contained"
                                        onClick={() => setIsParcelModalOpen(true)}
                                    >
                                        Registrar Parcela
                                    </Button>
                                )}
                            </Box>
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
                    {borrowing.hasReceipt && (
                        <Button
                            onClick={() => downloadReceipt()}
                            color="primary"
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            disabled={isPending}
                        >
                            {isPending ? 'Baixando...' : 'Comprovante'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>

            <ParcelRegistrationModal
                open={isParcelModalOpen}
                onClose={() => setIsParcelModalOpen(false)}
                borrowingId={borrowing.id}
                remainingValue={remainingValue}
            />
        </>
    );
}; 