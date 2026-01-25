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
    Chip, 
    Box 
} from '@mui/material';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import Header from "@/app/components/header/Header";

import EditTicketDialog from "../../components/(ticketComponents)/myTicketActions/EditTicketDialog";
import DeleteTicketButton from "../../components/(ticketComponents)/myTicketActions/DeleteTicketButton";

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

    const [tickets, rooms, categories, priorities] = await Promise.all([
        prisma.ticket.findMany({
            where: {
                reported_user: session.user.id,
            },
            include: {
                status_ticket_statusTostatus: true,
                priority_ticket_priorityTopriority: true,
                category_ticket_categoryTocategory: true,
                description_ticket_descriptionTodescription: true,
                room_ticket_roomToroom: true,
                user_processing: true,
                adminOrManagerComment: true,
            },
            orderBy: {
                created_time: 'desc',
            },
        }),
        prisma.room.findMany({
            select: { 
                room_id: true, 
                name: true 
            },
            orderBy: { name: 'asc' },
        }),
        prisma.category.findMany({
            select: { 
                category_id: true, 
                category_name: true 
            },
            orderBy: { category_name: 'asc' },
        }),
        prisma.priority.findMany({
            select: { 
                priority_id: true, 
                priority_type: true 
            },
            orderBy: { priority_type: 'asc' },
        }),
    ]);

    return (
        <Box 
            sx={{ 
                mb: 4 
            }}
        >
            <Box 
                sx={{ 
                    mb: 3 
                }}
            >
                <Header 
                    title="My reported tickets"
                    subtitle="Overview of all tickets you have submitted to the system."
                />
            </Box>

            <TableContainer 
                component={Paper}
                variant="outlined"
                sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    bgcolor: "background.paper",
                }}
            >
                <Table 
                    sx={{ 
                        minWidth: 650,
                        "& .MuiTableCell-head": {
                            fontWeight: 700,
                            color: "text.primary",
                            whiteSpace: "nowrap",
                        },
                        "& .MuiTableRow-root:last-child .MuiTableCell-body": {
                            borderBottom: 0,
                        },
                    }} 
                    aria-label="tickets table"
                    stickyHeader
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Title
                            </TableCell>
                            <TableCell>
                                Room
                            </TableCell>
                            <TableCell>
                                Category
                            </TableCell>
                            <TableCell>
                                Priority
                            </TableCell>
                            <TableCell>
                                Status
                            </TableCell>
                            <TableCell>
                                Processed By
                            </TableCell>
                            <TableCell>
                                Admin comment
                            </TableCell>
                            <TableCell 
                                align="right"
                            >
                                Created
                            </TableCell>
                            <TableCell align="right">
                                Actions
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
                                        variant={ticket.status === 1 ? "filled" : "outlined"}
                                    />
                                </TableCell>
                                <TableCell>
                                    {ticket.user_processing?.name || "Unassigned"}
                                </TableCell>
                                <TableCell sx={{ maxWidth: 320 }}>
                                    <Typography
                                        variant="body2"
                                        color={ticket.adminOrManagerComment?.text ? "text.primary" : "text.secondary"}
                                        sx={{
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                        title={ticket.adminOrManagerComment?.text ?? undefined}
                                    >
                                        {ticket.adminOrManagerComment?.text?.trim()?.length ? ticket.adminOrManagerComment.text : "—"}
                                    </Typography>
                                </TableCell>
                                <TableCell 
                                    align="right"
                                >
                                    {new Date(ticket.created_time).toLocaleDateString()}
                                </TableCell>
                                <TableCell align="right">
                                    <EditTicketDialog
                                        ticketId={ticket.ticket_id}
                                        title={ticket.ticket_title}
                                        descriptionId={ticket.description_ticket_descriptionTodescription.description_id}
                                        description={ticket.description_ticket_descriptionTodescription.description}
                                        roomId={ticket.room}
                                        categoryId={ticket.category}
                                        priorityId={ticket.priority}
                                        rooms={rooms}
                                        categories={categories}
                                        priorities={priorities}
                                    />
                                    <DeleteTicketButton 
                                        ticketId={ticket.ticket_id} 
                                        title={ticket.ticket_title} 
                                    />
                                </TableCell>
                            </TableRow>
                        ))
                        ) : (
                            <TableRow>
                                <TableCell 
                                    colSpan={9} 
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
        </Box>
    );
}