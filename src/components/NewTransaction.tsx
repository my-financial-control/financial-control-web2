import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    Button,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Box,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography,
    Paper,
    Grid,
    FormHelperText,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import { NumberFormatBase } from 'react-number-format';
import { useCategories } from '../hooks/useCategories';
import { useCreateTransaction } from '../hooks/useTransactions';
import type { TransactionType } from '../types/common';
import type { TransactionCreate } from '../types/transaction';
import { months } from '../utils/data';
import { currencyFormatterForField, formatCurrency } from '../utils/formatters';
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

    const [errors, setErrors] = useState({
        transactionType: false,
        categoryId: false,
        title: false,
        value: false,
        date: false,
    });

    const { data: categories = [] } = useCategories();
    const createTransaction = useCreateTransaction();

    const filteredCategories = categories.filter(cat => cat.type === transactionType);

    const validateStep = (step: number): boolean => {
        const newErrors = { ...errors };
        let isValid = true;

        switch (step) {
            case 0:
                if (!transactionType) {
                    newErrors.transactionType = true;
                    isValid = false;
                }
                if (!categoryId) {
                    newErrors.categoryId = true;
                    isValid = false;
                }
                break;
            case 1:
                if (!title.trim() || title.trim().length < 3) {
                    newErrors.title = true;
                    isValid = false;
                }
                if (!value || Number(value) <= 0) {
                    newErrors.value = true;
                    isValid = false;
                }
                break;
            case 2:
                if (!date) {
                    newErrors.date = true;
                    isValid = false;
                }
                break;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(activeStep)) {
            setActiveStep((prevStep) => prevStep + 1);
        }
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
                        <FormControl fullWidth sx={{ mb: 2 }} error={errors.transactionType}>
                            <InputLabel>Tipo de Transação *</InputLabel>
                            <Select
                                value={transactionType}
                                label="Tipo de Transação *"
                                onChange={(e) => {
                                    setTransactionType(e.target.value as TransactionType);
                                    setErrors(prev => ({ ...prev, transactionType: false }));
                                }}
                            >
                                <MenuItem value="CREDIT">Crédito</MenuItem>
                                <MenuItem value="EXPENSE">Despesa</MenuItem>
                            </Select>
                            {errors.transactionType && (
                                <FormHelperText>Este campo é obrigatório</FormHelperText>
                            )}
                        </FormControl>

                        {transactionType && (
                            <FormControl fullWidth error={errors.categoryId}>
                                <InputLabel>Categoria *</InputLabel>
                                <Select
                                    value={categoryId}
                                    label="Categoria *"
                                    onChange={(e) => {
                                        setCategoryId(e.target.value);
                                        setErrors(prev => ({ ...prev, categoryId: false }));
                                    }}
                                >
                                    {filteredCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.categoryId && (
                                    <FormHelperText>Este campo é obrigatório</FormHelperText>
                                )}
                            </FormControl>
                        )}
                    </Box>
                );

            case 1:
                return (
                    <Box sx={{ mt: 2 }}>
                        <TextField
                            fullWidth
                            label="Título *"
                            value={title}
                            onChange={(e) => {
                                setTitle(e.target.value);
                                setErrors(prev => ({ ...prev, title: false }));
                            }}
                            error={errors.title}
                            helperText={errors.title ? 'O título deve ter pelo menos 3 caracteres' : ''}
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
                        <NumberFormatBase
                            label="Valor *"
                            placeholder='R$ 0,00'
                            format={currencyFormatterForField}
                            prefix={"R$ "}
                            customInput={TextField}
                            fullWidth
                            sx={{ mb: 2 }}
                            value={value}
                            error={errors.value}
                            helperText={errors.value ? 'Este campo é obrigatório' : ''}
                            onValueChange={(values) => {
                                setValue(values.value);
                                setErrors(prev => ({ ...prev, value: false }));
                            }}
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
                                label="Data *"
                                value={date}
                                onChange={(newValue: Date | null) => {
                                    setDate(newValue);
                                    setErrors(prev => ({ ...prev, date: false }));
                                }}
                                sx={{ width: '100%', mb: 2 }}
                                slotProps={{
                                    textField: {
                                        error: errors.date,
                                        helperText: errors.date ? 'Este campo é obrigatório' : ''
                                    }
                                }}
                            />
                        </LocalizationProvider>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Mês *</InputLabel>
                            <Select
                                value={currentMonth}
                                label="Mês *"
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
                            <InputLabel>Ano *</InputLabel>
                            <Select
                                value={currentYear}
                                label="Ano *"
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
                                    <Typography variant="subtitle1">
                                        Valor: {formatCurrency(Number(value))}
                                    </Typography>
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
            <DialogContent>
                <Stepper activeStep={activeStep} orientation="vertical">
                    {steps.map((label, index) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                            <StepContent>
                                {activeStep === index && (
                                    <Box>
                                        {renderStepContent(activeStep)}
                                        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                            {activeStep > 0 && (
                                                <Button onClick={handleBack} variant="text">
                                                    Voltar
                                                </Button>
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
                                            <Button onClick={onClose} variant="text" color="secondary">
                                                Cancelar
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>
            </DialogContent>
        </Dialog>
    );
}
