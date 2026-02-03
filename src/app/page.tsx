// Next.js components
import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// MUI components
import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
} from "@mui/material";

// import custom components
import Header from "@/app/components/header/Header";

// Home page component
export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    const isLoggedIn = Boolean(session?.user);

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: { xs: 6, sm: 10 },
            }}
        >
            <Paper
                variant="outlined"
                sx={{
                    width: "100%",
                    maxWidth: 900,
                    borderRadius: 3,
                    p: { xs: 3, sm: 6 },
                    textAlign: "center",
                    bgcolor: "background.paper",
                }}
            >
                <Stack spacing={{ xs: 3, sm: 4 }} alignItems="center">
                    <Header
                        dense
                        title="Welcome to AssistSphere"
                        subtitle="Your solution for all assistance needs."
                    />

                    <Box component="main" sx={{ width: "100%" }}>
                        <Typography
                            variant="body1"
                            sx={{
                                mb: 2,
                                maxWidth: 720,
                                mx: "auto",
                                color: "text.secondary",
                            }}
                        >
                            AssistSphere is a modern ticketing system developed as a graduation project.
                            It helps users easily submit report tickets and track their status.
                        </Typography>

                        <Typography variant="h6" component="p" color="text.primary">
                            {isLoggedIn
                                ? "You are logged in."
                                : "To send a report ticket, please log in or register an account."}
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
                        {isLoggedIn ? (
                            <Button
                                href="/my_tickets"
                                component={Link}
                                variant="contained"
                                color="primary"
                                size="large"
                            >
                                My tickets
                            </Button>
                        ) : (
                            <>
                                <Button
                                    href="/login"
                                    component={Link}
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                >
                                    Log in
                                </Button>
                                <Button
                                    href="/register"
                                    component={Link}
                                    variant="outlined"
                                    color="primary"
                                    size="large"
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
}
