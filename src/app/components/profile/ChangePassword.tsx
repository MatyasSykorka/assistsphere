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
    InputAdornment,
    IconButton
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { authClient } from "@/lib/auth-client";

export default function ChangePassword() {
    const [open, setOpen] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClose = () => {
        setOpen(false);
        resetForm();
    };

    const resetForm = () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    };

    const handleChangePassword = async () => {
        setError("");
        setSuccess("");
        
        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
            return;
        }

        setLoading(true);

        const { error } = await authClient.changePassword({
            newPassword: newPassword,
            currentPassword: currentPassword,
            revokeOtherSessions: true
        });

        if (error) {
            setError(error.message || "Failed to change password");
        } else {
            setSuccess("Password changed successfully");
            setTimeout(() => {
                handleClose();
            }, 1500);
        }
        setLoading(false);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const toggleVisibility = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter((prev) => !prev);
    };

    const getSlotProps = (show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>) => ({
        input: {
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        onClick={() => toggleVisibility(setShow)}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                    >
                        {show ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            ),
        }
    });

    return (
        <>
            <Button 
                onClick={
                    () => setOpen(true)
                }
            >
                Change password
            </Button>
            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth maxWidth="sm"
            >
                <DialogTitle>
                    Change Password
                </DialogTitle>
                <DialogContent>
                    {error && 
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 2, 
                                mt: 1 
                            }}
                        >
                            {error}
                        </Alert>}
                    {success && 
                        <Alert 
                            severity="success" 
                            sx={{ 
                                mb: 2, 
                                mt: 1 
                            }}
                        >
                            {success}
                        </Alert>
                    }
                    
                    <TextField
                        margin="dense"
                        label="Current Password"
                        type={showCurrentPassword ? "text" : "password"}
                        fullWidth
                        value={currentPassword}
                        onChange={
                            (e) => setCurrentPassword(e.target.value)
                        }
                        slotProps={getSlotProps(showCurrentPassword, setShowCurrentPassword)}
                    />
                    <TextField
                        margin="dense"
                        label="New Password"
                        type={showNewPassword ? "text" : "password"}
                        fullWidth
                        value={newPassword}
                        onChange={
                            (e) => setNewPassword(e.target.value)
                        }
                        slotProps={getSlotProps(showNewPassword, setShowNewPassword)}
                    />
                    <TextField
                        margin="dense"
                        label="Confirm New Password"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        value={confirmPassword}
                        onChange={
                            (e) => setConfirmPassword(e.target.value)
                        }
                        slotProps={getSlotProps(showConfirmPassword, setShowConfirmPassword)}
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
                        onClick={handleChangePassword} 
                        disabled={loading || !currentPassword || !newPassword}
                    >
                        {loading ? "Updating..." : "Update Password"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
