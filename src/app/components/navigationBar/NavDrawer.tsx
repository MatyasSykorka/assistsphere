// keyword indicating that this is a client-side component
"use client";

// Next.js components
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// MUI components
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import MenuIcon from '@mui/icons-material/Menu';

import { authClient } from "@/lib/auth-client";

// Navigation drawer component
const NavDrawer: React.FC = () => {
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const { data: session } = authClient.useSession();

    const handleLogout = async () => {
        await authClient.signOut();
        router.push("/login");
    };

    return (
        <>
            <Button 
                variant="outlined"
                onClick={ () => setOpen(true) }
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
                onClose={() => setOpen(false)}
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
                {/* 
                    Role ID 
                        1 = Admin, 
                        2 = Manager        
                */}
                {session?.user && ((session.user as any).role_id === 1 || (session.user as any).role_id === 2) && (
                    <>
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
                    </>
                )}
                {session?.user && (session.user as any).role_id === 1 && (
                    <Button
                        component={Link}
                        href="/admin_panel"
                        color="error"
                    >
                        Admin Panel
                    </Button>
                )}
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
                    href="/contacts"
                >
                    Contacts
                </Button>
                <Button
                    component={Link}
                    href="/about"
                    color="secondary"
                >
                    About this project
                </Button>
                <Button
                    color="error"
                    onClick={handleLogout}
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