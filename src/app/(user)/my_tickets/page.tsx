import React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Typography, 
    Container, 
    Chip, 
    Box 
} from '@mui/material';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const getPriorityColor = 
(priority: string): "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning" => {
    const p = priority.toLowerCase();
    if (p.includes('high') || p.includes('critical')) { 
        return 'error' 
    };
    if (p.includes('medium')) {
        return 'warning';
    };
    if (p.includes('low')) {
        return 'success';
    }
    return 'default';
};

export default async function MyTicketsPage() {
    // 1. Verify Session with Better-auth
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login"); // Protect the route
    }

    // 2. Fetch tickets created by this user [cite: 18]
    const tickets = await prisma.ticket.findMany({
        where: {
            reported_user: session.user.id,
        },
        include: {
            status_ticket_statusTostatus: true,
            priority_ticket_priorityTopriority: true,
            category_ticket_categoryTocategory: true, 
            room_ticket_roomToroom: true,
            user_processing: true,
        },
        orderBy: {
            created_time: 'desc',
        },
    });

    return (
        <Container 
            maxWidth="lg" 
            sx={{ 
                mt: 4, 
                mb: 4 
            }}
        >
            <Box 
                sx={{ 
                    mb: 3 
                }}
            >
                <Typography 
                    variant="h4" 
                    component="h1" 
                    gutterBottom
                >
                    My Reported Tickets
                </Typography>
                <Typography 
                    variant="body1" 
                    color="text.secondary"
                >
                    Overview of all tickets you have submitted to the system.
                </Typography>
            </Box>

            <TableContainer 
                component={Paper} 
                elevation={3}
            >
                <Table 
                    sx={{ 
                        minWidth: 650 
                    }} 
                    aria-label="tickets table"
                >
                    <TableHead 
                        sx={{ 
                            backgroundColor: '#f5f5f5' 
                        }}
                    >
                        <TableRow>
                            <TableCell>
                                <strong>
                                    Title
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    Room
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    Category
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    Priority
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    Status
                                </strong>
                            </TableCell>
                            <TableCell>
                                <strong>
                                    Processed By
                                </strong>
                            </TableCell>
                            <TableCell 
                                align="right"
                            >
                                <strong>
                                    Created
                                </strong>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                            <TableRow 
                                key={ticket.ticket_id} 
                                hover
                            >
                                <TableCell>
                                    {ticket.ticket_title}
                                </TableCell> 
                                <TableCell>
                                    {ticket.room_ticket_roomToroom.name}
                                </TableCell>
                                <TableCell>
                                    {ticket.category_ticket_categoryTocategory.category_name}
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={ticket.priority_ticket_priorityTopriority.priority_type} 
                                        size="small" 
                                        variant="outlined"
                                        color={getPriorityColor(ticket.priority_ticket_priorityTopriority.priority_type)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={ticket.status_ticket_statusTostatus.status_name} 
                                        color={ticket.status === 1 ? "primary" : "default"} 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell>
                                    {ticket.user_processing?.name || "Unassigned"}
                                </TableCell>
                                <TableCell 
                                    align="right"
                                >
                                    {new Date(ticket.created_time).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell 
                                    colSpan={7} 
                                    align="center" 
                                    sx={{ 
                                        py: 3 
                                    }}
                                >
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary"
                                    >
                                        You have not created any tickets yet.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}