"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";

import DeleteIcon from "@mui/icons-material/Delete";

import { deleteMyTicket } from "../../../(user)/my_tickets/actions";

type Props = {
    ticketId: number;
    title?: string;
};

export default function DeleteTicketButton(props: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleOpen = () => {
        setError(null);
        setOpen(true);
    };

    const handleClose = () => {
        if (isPending) return;
        setOpen(false);
    };

    const handleDelete = () => {
        setError(null);
        startTransition(async () => {
            try {
                await deleteMyTicket(props.ticketId);
                setOpen(false);
                router.refresh();
            } catch (e) {
                const message = e instanceof Error ? e.message : "Failed to delete ticket";
                setError(message);
            }
        });
    };

    return (
        <>
            <Tooltip title="Delete">
                <IconButton
                    onClick={handleOpen}
                    size="small"
                    aria-label="delete ticket"
                    color="error"
                >
                    <DeleteIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
                <DialogTitle>Delete ticket</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}
                    <Typography>
                        Are you sure you want to delete this ticket{props.title ? `: "${props.title}"` : ""}?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleDelete}
                        disabled={isPending}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
