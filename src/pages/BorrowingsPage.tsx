import { Container, Typography, Box, Button, Skeleton, Fade } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useState } from "react";
import { BorrowingsTable } from "../components/BorrowingsTable";
import { useBorrowings } from "../hooks/useBorrowings";
import { NewBorrowing } from "../components/NewBorrowing";

const BorrowingsPage = () => {
    const { data: borrowings, isLoading } = useBorrowings();
    const [isNewBorrowingOpen, setIsNewBorrowingOpen] = useState(false);

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
            <Container sx={{ py: 4 }}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography
                            variant="h5"
                            fontWeight="bold"
                            color="text.primary"
                            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                            Empréstimos
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setIsNewBorrowingOpen(true)}
                        >
                            Novo Empréstimo
                        </Button>
                    </Box>

                    {isLoading ? (
                        <Skeleton
                            variant="rectangular"
                            height={400}
                            sx={{
                                borderRadius: 1,
                                bgcolor: 'rgba(0, 0, 0, 0.08)'
                            }}
                        />
                    ) : (
                        <Fade in={true} timeout={500}>
                            <Box>
                                <BorrowingsTable borrowings={borrowings ?? []} />
                            </Box>
                        </Fade>
                    )}
                </Box>
            </Container>

            <NewBorrowing
                open={isNewBorrowingOpen}
                onClose={() => setIsNewBorrowingOpen(false)}
            />
        </Box>
    );
};

export default BorrowingsPage;
