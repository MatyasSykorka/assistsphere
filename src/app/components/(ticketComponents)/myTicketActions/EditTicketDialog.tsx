"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Alert from "@mui/material/Alert";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import EditIcon from "@mui/icons-material/Edit";

import { updateMyTicket } from "../../../(user)/my_tickets/actions";

type Props = {
    ticketId: number;
    title: string;
    descriptionId: number;
    description: string;
    roomId: number;
    categoryId: number;
    priorityId: number;
    rooms: Array<{ room_id: number; name: string }>;
    categories: Array<{ category_id: number; category_name: string }>;
    priorities: Array<{ priority_id: number; priority_type: string }>;
};

export default function EditTicketDialog(props: Props) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const initial = useMemo(
        () => ({
            title: props.title,
            description: props.description,
            roomId: props.roomId,
            categoryId: props.categoryId,
            priorityId: props.priorityId,
        }),
        [props.title, props.description, props.roomId, props.categoryId, props.priorityId]
    );

    const [title, setTitle] = useState(initial.title);
    const [description, setDescription] = useState(initial.description);
    const [roomId, setRoomId] = useState<number>(initial.roomId);
    const [categoryId, setCategoryId] = useState<number>(initial.categoryId);
    const [priorityId, setPriorityId] = useState<number>(initial.priorityId);

    const handleOpen = () => {
        setError(null);
        setTitle(initial.title);
        setDescription(initial.description);
        setRoomId(initial.roomId);
        setCategoryId(initial.categoryId);
        setPriorityId(initial.priorityId);
        setOpen(true);
    };

    const handleClose = () => {
        if (isPending) return;
        setOpen(false);
    };

    const handleSave = () => {
        setError(null);

        const formData = new FormData();
        formData.set("ticketId", String(props.ticketId));
        formData.set("descriptionId", String(props.descriptionId));
        formData.set("title", title);
        formData.set("description", description);
        formData.set("roomId", String(roomId));
        formData.set("categoryId", String(categoryId));
        formData.set("priorityId", String(priorityId));

        startTransition(async () => {
            try {
                await updateMyTicket(formData);
                setOpen(false);
                router.refresh();
            } catch (e) {
                const message = e instanceof Error ? e.message : "Failed to update ticket";
                setError(message);
            }
        });
    };

    return (
        <>
            <Tooltip title="Edit">
                <IconButton onClick={handleOpen} size="small" aria-label="edit ticket">
                    <EditIcon fontSize="small" />
                </IconButton>
            </Tooltip>

            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>Edit ticket</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                    {error && <Alert severity="error">{error}</Alert>}

                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        disabled={isPending}
                    />

                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        fullWidth
                        multiline
                        minRows={4}
                        disabled={isPending}
                    />

                    <FormControl fullWidth disabled={isPending}>
                        <InputLabel id={`room-label-${props.ticketId}`}>Room</InputLabel>
                        <Select
                            labelId={`room-label-${props.ticketId}`}
                            label="Room"
                            value={roomId}
                            onChange={(e) => setRoomId(Number(e.target.value))}
                        >
                            {props.rooms.map((r) => (
                                <MenuItem key={r.room_id} value={r.room_id}>
                                    {r.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={isPending}>
                        <InputLabel id={`category-label-${props.ticketId}`}>Category</InputLabel>
                        <Select
                            labelId={`category-label-${props.ticketId}`}
                            label="Category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(Number(e.target.value))}
                        >
                            {props.categories.map((c) => (
                                <MenuItem key={c.category_id} value={c.category_id}>
                                    {c.category_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth disabled={isPending}>
                        <InputLabel id={`priority-label-${props.ticketId}`}>Priority</InputLabel>
                        <Select
                            labelId={`priority-label-${props.ticketId}`}
                            label="Priority"
                            value={priorityId}
                            onChange={(e) => setPriorityId(Number(e.target.value))}
                        >
                            {props.priorities.map((p) => (
                                <MenuItem key={p.priority_id} value={p.priority_id}>
                                    {p.priority_type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={handleClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleSave} disabled={isPending}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
