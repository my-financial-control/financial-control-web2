import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    Typography,
    IconButton,
    TextField,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { usePayParcel } from "../hooks/useBorrowings";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "../utils/formatters";
import { NumberFormatBase } from "react-number-format";
import { currencyFormatterForField } from "../utils/formatters";

interface ParcelRegistrationModalProps {
    open: boolean;
    onClose: () => void;
    borrowingId: string;
    remainingValue: number;
}

export const ParcelRegistrationModal = ({
    open,
    onClose,
    borrowingId,
    remainingValue,
}: ParcelRegistrationModalProps) => {
    const [value, setValue] = useState<number>(0);
    const queryClient = useQueryClient();
    const { mutate: payParcel, isPending } = usePayParcel(borrowingId, {
        value: value / 100,
        date: new Date().toISOString(),
    });

    useEffect(() => {
        if (!open) {
            setValue(0);
        }
    }, [open]);

    const handleSubmit = () => {
        payParcel(undefined, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['borrowings'] });
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">
                        Registrar Parcela
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Typography variant="subtitle2" color="text.secondary">
                        Valor Restante: {formatCurrency(remainingValue)}
                    </Typography>
                    <NumberFormatBase
                        label="Valor da Parcela"
                        placeholder="R$ 0,00"
                        format={currencyFormatterForField}
                        prefix="R$ "
                        customInput={TextField}
                        fullWidth
                        value={value}
                        onValueChange={(values) => {
                            setValue(values.value);
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isPending || value <= 0 || value > remainingValue * 100}
                >
                    Registrar
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 