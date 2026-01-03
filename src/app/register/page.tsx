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

export default function RegisterPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }

        const { 
            data, 
            error: authError 
        } = await authClient.signUp.email({
            name,
            email,
            password,
        });

        if (authError) {
            setError(authError.message || "Registration failed");
            setLoading(false);
        } else {
            router.push("/my_tickets");
        }
    };

    return (
        <Container component="main" maxWidth="xs">
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
                        Sign Up
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
                        onSubmit={handleRegister} 
                        noValidate
                    >
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Full name"
                            name="name"
                            autoComplete="given-name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            id="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            {loading ? "Creating account..." : "Sign Up"}
                        </Button>
                        <Box 
                            sx={{ 
                                textAlign: "center" 
                            }}
                        >
                            <MuiLink 
                                component={Link} 
                                href="/login" 
                                variant="body2"
                            >
                                {"Already have an account? Sign In"}
                            </MuiLink>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
}
