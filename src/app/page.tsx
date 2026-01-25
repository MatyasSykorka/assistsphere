// Next.js components
import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// MUI components
import {
    Box,
    Button,
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

    const content = (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "80vh",
                    textAlign: "center",
                    gap: 4,
                }}
            >
                <Header
                    title="Welcome to AssistSphere"
                    subtitle="Your solution for all assistance needs."
                />
                <main>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            mb: 2 
                        }}
                    >
                        AssistSphere is a modern ticketing system developed as a graduation project.
                        It helps users easily submit report tickets and track their status.
                    </Typography>
                    <Typography 
                        variant="h5" 
                        component="p" 
                        color="text.secondary"
                    >
                        {isLoggedIn
                            ? "You are logged in."
                            : "To send a report ticket, please log in or register an account."}
                    </Typography>
                </main>

                {!isLoggedIn && (
                    <Stack 
                        direction="row" 
                        spacing={2}
                    >
                        <Button
                            href="/login"
                            component={Link}
                            variant="contained"
                            color="primary"
                            size="large"
                        >
                            Log in
                        </Button>
                    </Stack>
                )}
            </Box>
    );

    if (!isLoggedIn) {
        return (
            <Box
                sx={{
                    bgcolor: "common.white",
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    py: { xs: 4, sm: 6 },
                }}
            >
                {content}
            </Box>
        );
    }

    return content;
}
