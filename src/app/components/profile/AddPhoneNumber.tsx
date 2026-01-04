"use client";

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
} from "@mui/material";

import { updatePhoneNumber } from "@/app/(settings)/profile/profile-change-phone-num";

interface AddPhoneNumberProps {
    currentPhoneNumber?: string | null;
}

export default function AddPhoneNumber({ currentPhoneNumber }: AddPhoneNumberProps) {
    const [open, setOpen] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState(currentPhoneNumber || "");
    const [error, setError] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setError(false);
        setPhoneNumber(currentPhoneNumber || "");
    };

    const validatePhoneNumber = (number: string) => {
        if (!number) return true; // Allow empty to clear the number
        // Remove spaces to check the structure
        const cleaned = number.replace(/\s/g, "");
        // Check for optional '+' followed by 9 to 15 digits
        return /^\+?\d{9,15}$/.test(cleaned);
    };

    const handleSave = async () => {
        if (!validatePhoneNumber(phoneNumber)) {
            setError(true);
            return;
        }
        await updatePhoneNumber(phoneNumber);
        setOpen(false);
    };

    return (
        <>
            <Button 
                onClick={handleClickOpen}
            >
                {currentPhoneNumber ? "Change phone number" : "Add phone number"}
            </Button>
            <Dialog 
                open={open} 
                onClose={handleClose}
            >
                <DialogTitle>
                    {currentPhoneNumber ? "Change Phone Number" : "Add Phone Number"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter your phone number below.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="phone"
                        label="Phone Number"
                        type="tel"
                        fullWidth
                        variant="standard"
                        value={phoneNumber}
                        onChange={(e) => {
                            setPhoneNumber(e.target.value);
                            setError(false);
                        }}
                        error={error}
                        helperText={error ? "Invalid phone number format (e.g. +420 568 878 444)" : ""}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleSave}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
