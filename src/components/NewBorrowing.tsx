import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    IconButton,
    Typography,
} from "@mui/material";
import {
    Close as CloseIcon,
} from "@mui/icons-material";
import { useForm, Controller, type FieldValues } from "react-hook-form";
import { type BorrowingCreate } from "../types/borrowing";
import { useCreateBorrowing } from "../hooks/useBorrowings";
import { useQueryClient } from "@tanstack/react-query";
import { NumberFormatBase } from "react-number-format";
import { currencyFormatterForField } from "../utils/formatters";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";
import { addDays } from "date-fns";

interface NewBorrowingProps {
    open: boolean;
    onClose: () => void;
}

export const NewBorrowing = ({ open, onClose }: NewBorrowingProps) => {
    const queryClient = useQueryClient();
    const { control, handleSubmit, reset, formState: { errors }, setValue, setError } = useForm<BorrowingCreate>({
        defaultValues: {
            borrower: '',
            value: 0,
            date: addDays(new Date(), 1).toISOString().split('T')[0],
        }
    });

    const { mutate: createBorrowing, isPending } = useCreateBorrowing();

    const onSubmit = (data: BorrowingCreate) => {
        createBorrowing({
            ...data,
            value: data.value / 100
        }, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['borrowings'] });
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">
                        Novo Empréstimo
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers>
                    <Box display="flex" flexDirection="column" gap={3}>
                        <Controller
                            name="borrower"
                            control={control}
                            rules={{ required: 'Campo obrigatório' }}
                            render={({ field }: { field: FieldValues }) => (
                                <TextField
                                    {...field}
                                    label="Emprestado para *"
                                    error={!!errors.borrower}
                                    helperText={errors.borrower?.message}
                                />
                            )}
                        />

                        <Controller
                            name="value"
                            control={control}
                            rules={{
                                required: 'Campo obrigatório',
                                min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                            }}
                            render={({ field }) => (
                                <NumberFormatBase
                                    label="Valor *"
                                    placeholder='R$ 0,00'
                                    format={currencyFormatterForField}
                                    prefix={"R$ "}
                                    customInput={TextField}
                                    fullWidth
                                    error={!!errors.value}
                                    helperText={errors.value?.message}
                                    value={field.value}
                                    onValueChange={(values) => {
                                        const numericValue = Number(values.value);
                                        setValue('value', numericValue);
                                        if (numericValue <= 0) {
                                            setError('value', { message: 'Valor deve ser maior que zero' });
                                        } else {
                                            setError('value', { message: '' });
                                        }
                                    }}
                                />
                            )}
                        />

                        <Controller
                            name="date"
                            control={control}
                            rules={{ required: 'Campo obrigatório' }}
                            render={({ field }) => (
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                                    <DatePicker
                                        label="Data do Empréstimo *"
                                        value={field.value ? new Date(field.value) : null}
                                        onChange={(newValue: Date | null) => {
                                            setValue('date', newValue ? newValue.toISOString().split('T')[0] : '');
                                            if (!newValue) {
                                                setError('date', { message: 'Campo obrigatório' });
                                            } else {
                                                setError('date', { message: '' });
                                            }
                                        }}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: !!errors.date,
                                                helperText: errors.date?.message,
                                            }
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Cancelar</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}; 