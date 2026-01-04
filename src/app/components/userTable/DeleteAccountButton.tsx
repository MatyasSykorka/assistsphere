"use client";

import { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { deleteAccount } from "@/app/(settings)/profile/profile-delete";

export default function DeleteAccountButton() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        const result = await deleteAccount();
        
        if (result.success) {
            await authClient.signOut();
            router.push("/login");
        } else {
            alert(result.error);
            setLoading(false);
            setOpen(false);
        }
    };

    return (
        <>
            <Button
                variant="outlined"
                color="error"
                onClick={() => setOpen(true)}
                sx={{
                    width: "15vw",
                    alignSelf: "center",
                    marginTop: "0.5rem",
                }}
            >
                Delete account
            </Button>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>Delete Account</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete your account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>Cancel</Button>
                    <Button onClick={handleDelete} color="error" autoFocus disabled={loading}>
                        {loading ? "Deleting..." : "Delete"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}