import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { Dashboard as DashboardIcon, CreditCard, BarChart } from "@mui/icons-material";

const Header = () => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    return (
        <>
            <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Finance Control
                    </Typography>

                    <Box component="nav">
                        <Box component="ul" display="flex" gap={3} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            <Box component="li">
                                <Button
                                    component={Link}
                                    to="/"
                                    startIcon={<DashboardIcon fontSize="small" />}
                                    sx={{
                                        color: isActive('/') ? 'primary.main' : 'text.secondary',
                                        fontWeight: isActive('/') ? 'medium' : 'regular',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'transparent',
                                        },
                                    }}
                                >
                                    Dashboard
                                </Button>
                            </Box>
                            <Box component="li">
                                <Button
                                    component={Link}
                                    to="/transactions"
                                    startIcon={<CreditCard fontSize="small" />}
                                    sx={{
                                        color: isActive('/transactions') ? 'primary.main' : 'text.secondary',
                                        fontWeight: isActive('/transactions') ? 'medium' : 'regular',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'transparent',
                                        },
                                    }}
                                >
                                    Transações
                                </Button>
                            </Box>
                            <Box component="li">
                                <Button
                                    component={Link}
                                    to="/consolidated"
                                    startIcon={<BarChart fontSize="small" />}
                                    sx={{
                                        color: isActive('/consolidated') ? 'primary.main' : 'text.secondary',
                                        fontWeight: isActive('/consolidated') ? 'medium' : 'regular',
                                        '&:hover': {
                                            color: 'primary.main',
                                            bgcolor: 'transparent',
                                        },
                                    }}
                                >
                                    Consolidado
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </>
    );
};

export default Header;
