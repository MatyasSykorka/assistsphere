// keyword indicating that this is a client-side component
"use client";

// Next.js components
import React, { useState } from "react";
import Link from "next/link";

// MUI components
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from '@mui/icons-material/Menu';

// Navigation drawer component
const NavDrawer: React.FC = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button 
                variant="outlined"
                onClick={ () => setOpen(true) }
                sx={{
                    position: 'fixed',
                    top: '1rem',
                    right: '1rem'
                }}
            >
                <MenuIcon />
            </Button>
            <Drawer 
                anchor="right" 
                open={open} 
                onClose={() => setOpen(false)}
                sx={{
                    '& .MuiDrawer-paper': {
                        display: 'flex',
                        flexDirection: 'column',
                        padding: '1rem',
                        width: '15vw',
                        boxSizing: 'border-box',
                        gap: '0.5rem'
                    },
                }}
            >
                <Button
                    href="/"
                    component={Link}
                    color="primary"
                >
                    Home
                </Button>
                <Button
                    component={Link}
                    href="/report"
                >
                    Report an issue
                </Button>
                <Button
                    component={Link}
                    href="/my_tickets"
                >
                    My tickets
                </Button>
                <Button
                    component={Link}
                    href="/tickets"
                >
                    All tickets
                </Button>
                <Button
                    component={Link}
                    href="/users"
                >
                    Users
                </Button>
                <Button
                    component={Link}
                    href="/profile"
                    sx={{
                        marginTop: "auto"
                    }}
                >
                    Profile settings
                </Button>
                <Button
                    component={Link}
                    href="/settings"
                >
                    Settings
                </Button>
                <Button
                    component={Link}
                    href="/about"
                >
                    About this project
                </Button>
                <Button
                    component={Link}
                    href="/contacts"
                >
                    Contacts
                </Button>
                <Button
                >
                    Log out
                </Button>
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => setOpen(false)}
                >
                    Close
                </Button>
            </Drawer>
        </>
    );
};

export default NavDrawer;