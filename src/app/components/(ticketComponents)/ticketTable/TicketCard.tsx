"use client";

import { useState } from "react";
import { 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Typography, 
    Chip, 
    Stack, 
    Avatar, 
    Box, 
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemButton,
    ListItemText
} from "@mui/material";
import { 
    deepOrange, 
    blue, 
    green, 
    red, 
    grey, 
    amber 
} from "@mui/material/colors";
import AssignTicketButton from "./AssignTicketButton";
import { updateTicketStatus } from "@/app/tickets/actions";

export default function TicketCard({ 
    ticket, 
    currentUserId, 
    currentUserRole, 
    statuses 
}: { 
    ticket: any, 
    currentUserId: string, 
    currentUserRole: number, 
    statuses: any[] 
}) {
    const [open, setOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleStatusOpen = () => setStatusOpen(true);
    const handleStatusClose = () => setStatusOpen(false);

    const handleStatusChange = async (statusId: number) => {
        await updateTicketStatus(ticket.ticket_id, statusId);
        handleStatusClose();
    };

    function getStatusColor(statusName: string | undefined) {
        switch (statusName) {
            case "Open":
                return `${deepOrange[400]}`;
            case "In Progress":
                return `${blue[500]}`;
            case "Resolved":
                return `${green[700]}`;
            case "Rejected":
                return `${red[500]}`;
            default:
                return `${grey[500]}`;
        }
    }

    function getPriorityColor(priorityType: string | undefined) {
        switch (priorityType?.toLowerCase()) {
            case "high":
                return `${red[700]}`;
            case "medium":
                return `${amber[700]}`;
            case "low":
                return `${green[600]}`;
            default:
                return `${grey[500]}`;
        }
    }

    const isClosed = ["Resolved", "Rejected"].includes(ticket.status_ticket_statusTostatus?.status_name);

    return (
        <>
            <Card 
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: isClosed ? grey[200] : 'background.paper'
                }}
            >
                <CardContent 
                    sx={{ 
                        flexGrow: 1 
                    }}
                >
                    <Stack 
                        direction="row" 
                        justifyContent="space-between" 
                        alignItems="center" 
                        mb={2}
                    >
                        <Typography 
                            variant="caption" 
                            color="text.secondary"
                        >
                            #{ticket.ticket_id} • {new Date(ticket.created_time).toLocaleDateString()}
                        </Typography>
                        <Chip 
                            label={ticket.status_ticket_statusTostatus?.status_name ?? "Unknown"} 
                            size="small"
                            sx={{ 
                                bgcolor: getStatusColor(ticket.status_ticket_statusTostatus?.status_name),
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    </Stack>
                    
                    <Typography 
                        variant="h6" 
                        component="div" 
                        gutterBottom 
                        fontWeight="bold"
                        noWrap
                    >
                        {ticket.ticket_title}
                    </Typography>

                    <Stack 
                        direction="row" 
                        spacing={1} 
                        mb={2}
                        justifyContent="center"
                    >
                        <Chip 
                            label={ticket.priority_ticket_priorityTopriority?.priority_type ?? "Normal"} 
                            size="small" 
                            variant="outlined"
                            sx={{ 
                                borderColor: getPriorityColor(
                                    ticket.priority_ticket_priorityTopriority?.priority_type
                                ),
                                color: getPriorityColor(
                                    ticket.priority_ticket_priorityTopriority?.priority_type
                                )
                            }}
                        />
                        <Chip 
                            label={ticket.category_ticket_categoryTocategory?.category_name ?? "General"} 
                            size="small" 
                            variant="outlined"
                        />
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Stack 
                        spacing={1}
                    >
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                        >
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                width={80}
                            >
                                Room:
                            </Typography>
                            <Typography 
                                variant="body2" 
                                fontWeight="medium"
                            >
                                {ticket.room_ticket_roomToroom?.name}
                            </Typography>
                        </Box>
                        
                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                        >
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                width={80}
                            >
                                Reporter:
                            </Typography>
                            <Stack 
                                direction="row" 
                                alignItems="center" 
                                gap={1}
                            >
                                <Avatar 
                                    src={ticket.user_reported?.image || undefined} 
                                    alt={ticket.user_reported?.name}
                                    sx={{ 
                                        width: 24, 
                                        height: 24, 
                                        fontSize: '0.75rem' 
                                    }}
                                >
                                    {ticket.user_reported?.name?.charAt(0)}
                                </Avatar>
                                <Typography 
                                    variant="body2"
                                >
                                    {ticket.user_reported?.name}
                                </Typography>
                            </Stack>
                        </Box>

                        <Box 
                            display="flex" 
                            alignItems="center" 
                            gap={1}
                        >
                            <Typography 
                                variant="body2" 
                                color="text.secondary" 
                                width={80}
                            >
                                Assignee:
                            </Typography>
                            <Typography 
                                variant="body2"
                            >
                                {ticket.user_processing ? 
                                    ticket.user_processing.name : 
                                    "Unassigned"
                                }
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
                <CardActions 
                    sx={{ 
                        p: 2, 
                        pt: 0 
                    }}
                >
                    <Stack 
                        spacing={1} 
                        width="100%"
                    >
                        <Button 
                            size="small" 
                            variant="contained" 
                            color="secondary"
                            fullWidth 
                            onClick={handleOpen}
                        >
                            View Details
                        </Button>
                        {ticket.processing_user === currentUserId && (
                            <Button 
                                size="small" 
                                variant="contained" 
                                color="warning"
                                fullWidth 
                                onClick={handleStatusOpen}
                            >
                                Change Status
                            </Button>
                        )}
                        {(currentUserRole === 1 || currentUserRole === 2) && (
                            <AssignTicketButton 
                                ticketId={ticket.ticket_id} 
                                isAssignedToMe={ticket.processing_user === currentUserId}
                                isAssignedToOther={!!ticket.processing_user && ticket.processing_user !== currentUserId}
                            />
                        )}
                    </Stack>
                </CardActions>
            </Card>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
            >
                <DialogTitle>
                    Ticket #{ticket.ticket_id} Details
                </DialogTitle>
                <DialogContent 
                    dividers
                >
                    <Typography 
                        variant="h6" 
                        gutterBottom
                    >
                        {ticket.ticket_title}
                    </Typography>
                    <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        gutterBottom
                    >
                        Description
                    </Typography>
                    <Typography 
                        variant="body1" 
                        sx={{ 
                            whiteSpace: 'pre-wrap' 
                        }}
                    >
                        {ticket.description_ticket_descriptionTodescription?.description}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog 
                open={statusOpen} 
                onClose={handleStatusClose} 
                fullWidth 
                maxWidth="xs"
            >
                <DialogTitle>Change Status</DialogTitle>
                <DialogContent dividers>
                    <List>
                        {statuses?.filter((status) => status.status_name !== "Open").map((status) => (
                            <ListItem 
                                key={status.status_id} 
                                disablePadding
                            >
                                <ListItemButton 
                                    onClick={
                                        () => handleStatusChange(status.status_id)
                                    }
                                >
                                    <ListItemText 
                                        primary={status.status_name} 
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleStatusClose}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}