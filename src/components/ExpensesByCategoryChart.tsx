import { Box, Paper, Typography, Skeleton, Fade, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Text } from 'recharts';
import { useTransactions } from '../hooks/useTransactions';
import { formatCurrency } from '../utils/formatters';
import type { DateFilters } from '../types/common';
import { useState } from 'react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FF6B6B', '#4ECDC4'];

type ChartType = 'pie' | 'bar';

interface ExpensesByCategoryChartProps {
    filters: DateFilters;
}

// Custom XAxis label for bar chart (rotated)
function renderXAxisTick({ x, y, payload }: any) {
    return (
        <g transform={`translate(${x},${y})`}>
            <Text x={0} y={0} dy={16} textAnchor="end" fill="#666" fontSize={12} transform="rotate(-35)">
                {payload.value}
            </Text>
        </g>
    );
}

// Custom label for pie chart (outside, with line)
function renderPieLabel({ cx, cy, midAngle, outerRadius, percent, name }: any) {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 16;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return (
        <text x={x} y={y} fill="#333" fontSize={12} textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {name} ({(percent * 100).toFixed(0)}%)
        </text>
    );
}

export function ExpensesByCategoryChart({ filters }: ExpensesByCategoryChartProps) {
    const [chartType, setChartType] = useState<ChartType>('pie');
    const { data: transactions, isLoading } = useTransactions({ ...filters, type: 'EXPENSE' });

    if (isLoading) {
        return (
            <Skeleton variant="rounded" height={400} sx={{ borderRadius: 2 }} />
        );
    }

    // Calculate totals by category
    const categoryTotals = transactions?.reduce((acc, transaction) => {
        const categoryName = transaction.category?.name || 'Sem categoria';
        acc[categoryName] = (acc[categoryName] || 0) + transaction.value;
        return acc;
    }, {} as Record<string, number>) || {};

    const chartData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value
    }));

    const handleChartTypeChange = (_: React.MouseEvent<HTMLElement>, newType: ChartType | null) => {
        if (newType !== null) {
            setChartType(newType);
        }
    };

    return (
        <Fade in={true} timeout={500}>
            <Paper
                elevation={0}
                variant="outlined"
                sx={{ p: 3, borderRadius: 2, height: '100%' }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" color="text.secondary">
                        Gastos por Categoria
                    </Typography>
                    <ToggleButtonGroup
                        value={chartType}
                        exclusive
                        onChange={handleChartTypeChange}
                        size="small"
                    >
                        <ToggleButton value="pie">Pizza</ToggleButton>
                        <ToggleButton value="bar">Barras</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                <Box sx={{ width: '100%', height: 320 }}>
                    <ResponsiveContainer>
                        {chartType === 'pie' ? (
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    // Removendo label para evitar sobreposição
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value: number, name: string, props: any) => [formatCurrency(value), props.payload.name]}
                                />
                            </PieChart>
                        ) : (
                            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 60, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" interval={0} height={60} tick={renderXAxisTick} />
                                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                <Tooltip
                                    formatter={(value: number) => formatCurrency(value)}
                                />
                                <Bar dataKey="value" fill="#8884d8">
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </Box>
            </Paper>
        </Fade>
    );
} 