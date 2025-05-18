import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#9b87f5',
            light: '#D6BCFA',
            dark: '#7E69AB',
        },
        secondary: {
            main: '#6E59A5',
            light: '#9b87f5',
            dark: '#1A1F2C',
        },
        error: {
            main: '#FF5252',
        },
        success: {
            main: '#4CAF50',
        },
        background: {
            default: '#F9FAFB',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1F2C',
            secondary: '#8E9196',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    fontWeight: 600,
                },
            },
        },
    },
});

export default theme;