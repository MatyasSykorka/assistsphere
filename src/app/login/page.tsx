"use client";

import React, { useState } from "react";
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Alert, 
    Paper,
    Link as MuiLink
} from "@mui/material";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent page reload
        setLoading(true);
        setError("");
        
        const { 
            data, 
            error: authError 
        } = await authClient.signIn.email({
            email: emailOrUsername,
            password,
        });

        if (authError) {
            setError(authError.message || "Invalid email/username or password");
            setLoading(false);
        }
        else {
            // Success! Redirect to dashboard
            router.push("/my_tickets");
        }
    };

    return (
        <Container 
            component="main" 
            maxWidth="xs"
        >
            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        width: "100%", 
                        borderRadius: 2 
                    }}
                >
                    <Typography 
                        component="h1" 
                        variant="h5" 
                        align="center" 
                        gutterBottom
                    >
                        Sign In
                    </Typography>

                    {error && (
                        <Alert 
                            severity="error" 
                            sx={{ mb: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Box 
                        component="form" 
                        onSubmit={handleLogin} 
                        noValidate
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={emailOrUsername}
                            onChange={(e) => setEmailOrUsername(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{ 
                                mt: 3, 
                                mb: 2, 
                                py: 1.5 
                            }}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                        <Box 
                            sx={{ 
                                textAlign: "center" 
                            }}>
                            <MuiLink 
                                component={Link} 
                                href="/register" 
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}