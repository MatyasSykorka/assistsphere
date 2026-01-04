"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Box,
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography,
} from "@mui/material";
import { createTicket } from "@/app/components/ticketForm/ticketAction";

type Room = {
    room_id: number;
    name: string;
};

type Category = {
    category_id: number;
    category_name: string;
};

type Priority = {
    priority_id: number;
    priority_type: string;
};

interface TicketFormProps {
    rooms: Room[];
    categories: Category[];
    priorities: Priority[];
}

export default function TicketForm({
    rooms,
    categories,
    priorities,
}: TicketFormProps) {
    const [title, setTitle] = useState("");
    const [roomId, setRoomId] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [priorityId, setPriorityId] = useState("");
    const [description, setDescription] = useState("");

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const result = await createTicket({
            title,
            roomId: Number(roomId),
            categoryId: Number(categoryId),
            priorityId: Number(priorityId),
            description,
        });

        if (result.success) {
            setTitle("");
            setRoomId("");
            setCategoryId("");
            setPriorityId("");
            setDescription("");
            router.push("/my_tickets");
        } else {
            alert("Failed to submit ticket.");
        }
    };

    return (
        <Paper 
            elevation={3} 
            sx={
                { p: 3 }
            }
        >
            <Typography 
                variant="h6" 
                gutterBottom
            >
                Ticket Details
            </Typography>
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ 
                    display: "flex", 
                    flexDirection: "column", 
                    gap: 2 
                }}
            >
                <TextField
                    label="Title"
                    value={title}
                    onChange={
                        (e) => setTitle(e.target.value)
                    }
                    fullWidth
                    required
                />
                    <FormControl 
                        fullWidth 
                        required
                    >
                        <InputLabel 
                            id="room-label"
                        >
                            room
                        </InputLabel>
                        <Select
                            labelId="room-label"
                            value={roomId}
                            label="Room"
                            onChange={
                                (e: SelectChangeEvent) => setRoomId(e.target.value)
                            }
                        >
                            {rooms.map((room) => (
                                <MenuItem 
                                    key={room.room_id} 
                                    value={room.room_id}
                                >
                                    {room.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl 
                        fullWidth 
                        required
                    >
                        <InputLabel 
                            id="category-label"
                        >
                            Category
                        </InputLabel>
                        <Select
                            labelId="category-label"
                            value={categoryId}
                            label="Category"
                            onChange={
                                (e: SelectChangeEvent) => setCategoryId(e.target.value)
                            }
                        >
                            {
                            categories.map((category) => (
                                <MenuItem 
                                    key={category.category_id} 
                                    value={category.category_id}
                                >
                                    {category.category_name}
                                </MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                    <FormControl 
                        fullWidth 
                        required
                    >
                        <InputLabel 
                            id="priority-label"
                        >
                            Priority
                        </InputLabel>
                        <Select
                            labelId="priority-label"
                            value={priorityId}
                            label="Priority"
                            onChange={
                                (e: SelectChangeEvent) => setPriorityId(e.target.value)
                            }
                        >
                            {
                            priorities.map((priority) => (
                                <MenuItem 
                                    key={priority.priority_id} 
                                    value={priority.priority_id}
                                >
                                    {priority.priority_type}
                                </MenuItem>
                            ))
                            }
                        </Select>
                    </FormControl>
                <TextField
                    label="Description"
                    value={description}
                    onChange={
                        (e) => setDescription(e.target.value)
                    }
                    multiline
                    rows={4}
                    fullWidth
                    required
                />
                <Button 
                    type="submit" 
                    variant="contained" 
                    size="large"
                >
                    Submit Ticket
                </Button>
            </Box>
        </Paper>
    );
}