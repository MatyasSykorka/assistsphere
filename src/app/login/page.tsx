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
    InputAdornment,
    IconButton
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { createAppTheme } from "@/theme";

const loginTheme = createAppTheme("light");

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { 
            data, 
            error: authError 
        } = await authClient.signIn.email({
            email,
            password,
        });

        if (authError) {
            setError(authError.message || "Login failed");
            setLoading(false);
        } else {
            router.push("/my_tickets");
        }
    };

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    return (
        <ThemeProvider theme={loginTheme}>
            <CssBaseline />
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
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                slotProps={{
                                    input: {
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    onMouseUp={handleMouseUpPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
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
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </ThemeProvider>
    );
}