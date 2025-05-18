import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stepper,
    Step,
    StepLabel,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { useCategories } from '../hooks/useCategories';
import { useCreateTransaction } from '../hooks/useTransactions';
import type { TransactionType } from '../types/common';
import type { TransactionCreate } from '../types/transaction';
import { months } from '../utils/data';

const steps = ['Tipo e Categoria', 'Detalhes', 'Data', 'Revisão'];


interface NewTransactionProps {
    open: boolean;
    onClose: () => void;
}

export function NewTransaction({ open, onClose }: NewTransactionProps) {
    const [activeStep, setActiveStep] = useState(0);
    const [transactionType, setTransactionType] = useState<TransactionType | ''>('');
    const [categoryId, setCategoryId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [receipt, setReceipt] = useState<File | null>(null);

    const { data: categories = [] } = useCategories();
    const createTransaction = useCreateTransaction();

    const filteredCategories = categories.filter(cat => cat.type === transactionType);

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async () => {
        if (!date) return;

        const transaction: TransactionCreate = {
            title,
            description,
            value: Number(value),
            type: transactionType as TransactionType,
            currentMonth,
            currentYear,
            date,
            categoryId: categoryId || undefined,
        };

        try {
            await createTransaction.mutateAsync({ transaction, receipt });
            onClose();
        } catch (error) {
            console.error('Error creating transaction:', error);
        }
    };

    const renderStepContent = (step: number) => {
        switch (step) {
            case 0:
                return (
                    <Box sx={{ mt: 2 }}>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Tipo de Transação</InputLabel>
                            <Select
                                value={transactionType}
                                label="Tipo de Transação"
                                onChange={(e) => setTransactionType(e.target.value as TransactionType)}
                            >
                                <MenuItem value="CREDIT">Crédito</MenuItem>
                                <MenuItem value="EXPENSE">Despesa</MenuItem>
                            </Select>
                        </FormControl>

                        {transactionType && (
                            <FormControl fullWidth>
                                <InputLabel>Categoria</InputLabel>
                                <Select
                                    value={categoryId}
                                    label="Categoria"
                                    onChange={(e) => setCategoryId(e.target.value)}
                                >
                                    {filteredCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Título"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Descrição"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Valor"
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="outlined"
                            component="label"
                            fullWidth
                        >
                            {receipt ? 'Comprovante selecionado' : 'Selecionar comprovante'}
                            <input
                                type="file"
                                hidden
                                onChange={(e) => setReceipt(e.target.files?.[0] || null)}
                            />
                        </Button>
                    </Box>
                );

            case 2:
                return (
                    <Box sx={{ mt: 2 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
                            <DatePicker
                                label="Data"
                                value={date}
                                onChange={(newValue: Date | null) => setDate(newValue)}
                                sx={{ width: '100%', mb: 2 }}
                            />
                        </LocalizationProvider>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Mês</InputLabel>
                            <Select
                                value={currentMonth}
                                label="Mês"
                                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                            >
                                {months.map((month) => (
                                    <MenuItem key={month.value} value={month.value}>
                                        {month.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Ano</InputLabel>
                            <Select
                                value={currentYear}
                                label="Ano"
                                onChange={(e) => setCurrentYear(Number(e.target.value))}
                            >
                                {[currentYear - 1, currentYear, currentYear + 1].map((year) => (
                                    <MenuItem key={year} value={year}>
                                        {year}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                );

            case 3:
                return (
                    <Box sx={{ mt: 2 }}>
                        <Paper sx={{ p: 2 }}>
                            <Grid container spacing={2}>
                                <Grid>
                                    <Typography variant="subtitle1">Tipo: {transactionType === 'CREDIT' ? 'Crédito' : 'Despesa'}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">
                                        Categoria: {filteredCategories.find(c => c.id === categoryId)?.name}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">Título: {title}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">Descrição: {description}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">Valor: R$ {Number(value).toFixed(2)}</Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">
                                        Data: {date?.toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">
                                        Mês: {months.find(m => m.value === currentMonth)?.label}
                                    </Typography>
                                </Grid>
                                <Grid>
                                    <Typography variant="subtitle1">Ano: {currentYear}</Typography>
                                </Grid>
                                {receipt && (
                                    <Grid>
                                        <Typography variant="subtitle1">
                                            Comprovante: {receipt.name}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Box>
                );

            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Nova Transação</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {renderStepContent(activeStep)}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                {activeStep > 0 && (
                    <Button onClick={handleBack}>Voltar</Button>
                )}
                {activeStep === steps.length - 1 ? (
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Salvar
                    </Button>
                ) : (
                    <Button onClick={handleNext} variant="contained" color="primary">
                        Próximo
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
