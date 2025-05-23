import { Link, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, Button, IconButton, Drawer, List, ListItem } from "@mui/material";
import { Dashboard as DashboardIcon, CreditCard, BarChart, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";

const Header = () => {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const menuItems = [
        { path: '/', label: 'Dashboard', icon: <DashboardIcon fontSize="small" /> },
        { path: '/transactions', label: 'Transações', icon: <CreditCard fontSize="small" /> },
        { path: '/consolidated', label: 'Consolidado', icon: <BarChart fontSize="small" /> },
    ];

    const drawer = (
        <List>
            {menuItems.map((item) => (
                <ListItem key={item.path} disablePadding>
                    <Button
                        component={Link}
                        to={item.path}
                        startIcon={item.icon}
                        fullWidth
                        sx={{
                            color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                            fontWeight: isActive(item.path) ? 'medium' : 'regular',
                            justifyContent: 'flex-start',
                            px: 2,
                            py: 1.5,
                            '&:hover': {
                                color: 'primary.main',
                                bgcolor: 'transparent',
                            },
                        }}
                        onClick={handleDrawerToggle}
                    >
                        {item.label}
                    </Button>
                </ListItem>
            ))}
        </List>
    );

    return (
        <>
            <AppBar position="fixed" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
                <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
                    <Typography variant="h5" fontWeight="bold" color="text.primary">
                        Finance Control
                    </Typography>

                    {/* Mobile menu button */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    {/* Desktop navigation */}
                    <Box component="nav" sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Box component="ul" display="flex" gap={3} sx={{ listStyle: 'none', p: 0, m: 0 }}>
                            {menuItems.map((item) => (
                                <Box component="li" key={item.path}>
                                    <Button
                                        component={Link}
                                        to={item.path}
                                        startIcon={item.icon}
                                        sx={{
                                            color: isActive(item.path) ? 'primary.main' : 'text.secondary',
                                            fontWeight: isActive(item.path) ? 'medium' : 'regular',
                                            '&:hover': {
                                                color: 'primary.main',
                                                bgcolor: 'transparent',
                                            },
                                        }}
                                    >
                                        {item.label}
                                    </Button>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                anchor="right"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
                }}
            >
                {drawer}
            </Drawer>

            <Toolbar />
        </>
    );
};

export default Header;
