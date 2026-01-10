'use client';

import React, { useState } from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { deleteUser } from "./deleteUserAction";

interface DeleteUserModalProps {
    open: boolean;
    onClose: () => void;
    user: { 
        id: string; 
        name: string; 
        email: string 
    } | null;
}

export default function DeleteUserModal({
    open,
    onClose,
    user,
}: DeleteUserModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        if (user) {
            setLoading(true);
            try {
                await deleteUser(user.id);
                router.refresh();
                onClose();
            } 
            catch (error) {
                console.error("Failed to delete user:", error);
            } 
            finally {
                setLoading(false);
            }
        }
    };

    if (!user) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
        >
            <DialogTitle>Delete User</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete user <strong>{user.name}</strong> ({user.email})?
                    This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button 
                    onClick={onClose} 
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={handleDelete} 
                    color="error" 
                    variant="contained" 
                    autoFocus
                    disabled={loading}
                >
                    {loading ? "Deleting..." : "Delete"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
