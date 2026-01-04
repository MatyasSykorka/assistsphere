"use client";

import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Alert,
    DialogContentText
} from "@mui/material";
import { authClient } from "@/lib/auth-client";

export default function ChangeEmail({ currentEmail }: { currentEmail?: string }) {
    const [open, setOpen] = useState(false);
    const [newEmail, setNewEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleClose = () => {
        setOpen(false);
        setNewEmail("");
        setError("");
        setSuccess("");
    };

    const handleChangeEmail = async () => {
        setError("");
        setSuccess("");
        setLoading(true);

        const { error } = await authClient.changeEmail({
            newEmail: newEmail,
        });

        if (error) {
            setError(error.message || "Failed to change email");
        }
        else {
            setSuccess("Verification email sent to new address. Please verify to complete the change.");
            setTimeout(() => {
                handleClose();
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <>
            <Button 
                onClick={
                    () => setOpen(true)
                }
            >
                Change email
            </Button>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
            >
                <DialogTitle>
                    Change Email
                </DialogTitle>
                <DialogContent>
                    <DialogContentText 
                        sx={{ 
                            mb: 2 
                        }}
                    >
                        Current email: {currentEmail}
                    </DialogContentText>
                    {error && 
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 2 
                            }}
                        >
                            {error}
                        </Alert>
                    }
                    {success && 
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mb: 2 
                            }}
                        >
                            {success}
                        </Alert>
                    }
                    
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Email Address"
                        type="email"
                        fullWidth
                        value={newEmail}
                        onChange={
                            (e) => setNewEmail(e.target.value)
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose} 
                        disabled={loading}
                    >    
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleChangeEmail} 
                        disabled={loading || !newEmail}
                    >
                        {loading ? "Sending..." : "Send Verification"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
