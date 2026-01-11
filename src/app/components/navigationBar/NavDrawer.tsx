// keyword indicating that this is a client-side component
"use client";

// Next.js components
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// MUI components
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";
import MenuIcon from '@mui/icons-material/Menu';

import { authClient } from "@/lib/auth-client";
import { useThemePreset } from "@/app/providers";

// Navigation drawer component
const NavDrawer: React.FC = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();
    const { preset, setPreset } = useThemePreset();
    const isLoggedIn = Boolean(session?.user);
    const roleId = (session?.user as unknown as { role_id?: number | null } | undefined)?.role_id;
    const closeDrawer = () => setOpen(false);

    const drawerButtonSx = {
        justifyContent: "center",
        textAlign: "center" as const,
    };

    const handleThemeChange = (event: SelectChangeEvent) => {
        const nextPreset = event.target.value as typeof preset;
        setPreset(nextPreset);
    };

    const handleLogout = async () => {
        closeDrawer();
        await authClient.signOut();
        router.push("/login");
    };

    const content = (
        <>
            <Button 
                variant="outlined"
                onClick={ 
                    () => setOpen(true) 
                }
                sx={{
                    position: "fixed",
                    top: "1rem",
                    right: "1rem"
                }}
            >
                <MenuIcon />
            </Button>
            <Drawer 
                anchor="right" 
                open={open} 
                onClose={
                    () => setOpen(false)
                }
                sx={{
                    "& .MuiDrawer-paper": {
                        display: "flex",
                        flexDirection: "column",
                        padding: "1rem",
                        width: "15vw",
                        boxSizing: "border-box",
                        gap: "0.5rem"
                    },
                }}
            >
                <Button
                    href="/"
                    component={Link}
                    color="primary"
                    fullWidth
                    sx={drawerButtonSx}
                    onClick={closeDrawer}
                >
                    Home
                </Button>
                {isLoggedIn && (
                    <Button
                        component={Link}
                        href="/report"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={closeDrawer}
                    >
                        Report an issue
                    </Button>
                )}
                {isLoggedIn && (
                    <Button
                        component={Link}
                        href="/my_tickets"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={closeDrawer}
                    >
                        My tickets
                    </Button>
                )}
                {(roleId === 1 || roleId === 2) && (
                    <Button
                        component={Link}
                        href="/tickets"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={closeDrawer}
                    >
                        All tickets
                    </Button>
                )}
                {roleId === 1 && (
                    <Button
                        component={Link}
                        href="/users"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={closeDrawer}
                    >
                        Users
                    </Button>
                )}
                {roleId === 1 && (
                    <Button
                        component={Link}
                        href="/admin_panel"
                        color="error"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={closeDrawer}
                    >
                        Admin Panel
                    </Button>
                )}
                {isLoggedIn && (
                    <Button
                        component={Link}
                        href="/profile"
                        sx={{
                            marginTop: "auto",
                            ...drawerButtonSx,
                        }}
                        fullWidth
                        onClick={closeDrawer}
                    >
                        Profile settings
                    </Button>
                )}
                {
                    isLoggedIn && (
                        <FormControl 
                            size="small" 
                            fullWidth
                        >
                            <InputLabel 
                                id="theme-preset-label"
                            >
                                Theme
                            </InputLabel>
                            <Select
                                labelId="theme-preset-label"
                                value={preset}
                                label="Theme"
                                onChange={handleThemeChange}
                            >
                                <MenuItem value="light">Light</MenuItem>
                                <MenuItem value="dark">Dark</MenuItem>
                                <MenuItem value="blue">Blue</MenuItem>
                                <MenuItem value="blueDark">Blue (Dark)</MenuItem>
                                <MenuItem value="orange">Orange</MenuItem>
                                <MenuItem value="orangeDark">Orange (Dark)</MenuItem>
                                <MenuItem value="red">Red</MenuItem>
                                <MenuItem value="redDark">Red (Dark)</MenuItem>
                                <MenuItem value="purple">Purple</MenuItem>
                                <MenuItem value="purpleDark">Purple (Dark)</MenuItem>
                            </Select>
                        </FormControl>
                    )
                }
                
                {isLoggedIn && (
                    <Button
                        component={Link}
                        href="/contacts"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={closeDrawer}
                    >
                        Contacts
                    </Button>
                )}
                <Button
                    component={Link}
                    href="/about"
                    color="secondary"
                    sx={
                        !isLoggedIn
                            ? {
                                marginTop: "auto",
                                ...drawerButtonSx,
                            }
                            : drawerButtonSx
                    }
                    fullWidth
                    onClick={closeDrawer}
                >
                    About this project
                </Button>
                {isLoggedIn && (
                    <Button
                        color="error"
                        fullWidth
                        sx={drawerButtonSx}
                        onClick={
                            handleLogout
                        }
                    >
                        Log out
                    </Button>
                )}
                <Button
                    color="secondary"
                    variant="contained"
                    fullWidth
                    sx={drawerButtonSx}
                    onClick={
                        closeDrawer
                    }
                >
                    Close
                </Button>
            </Drawer>
        </>
    );

    return content;
};

export default NavDrawer;