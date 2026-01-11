"use client";

import { useEffect, useRef, useState } from "react";
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
    ListItemText,
    TextField,
    Snackbar
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { alpha } from "@mui/material/styles";
import AssignTicketButton from "./AssignTicketButton";
import { updateTicketAdminComment, updateTicketStatus } from "@/app/tickets/actions";

type TicketCardStatus = {
    status_id: number;
    status_name: string;
};

type TicketCardTicket = {
    ticket_id: number;
    created_time: string;
    ticket_title: string;
    processing_user: string | null;
    adminOrManagerComment?: { text: string } | null;
    status_ticket_statusTostatus?: { status_name: string } | null;
    priority_ticket_priorityTopriority?: { priority_type: string } | null;
    category_ticket_categoryTocategory?: { category_name: string } | null;
    room_ticket_roomToroom?: { name: string } | null;
    description_ticket_descriptionTodescription?: { description: string } | null;
    user_reported?: { name: string; image?: string | null } | null;
    user_processing?: { name: string } | null;
};

export default function TicketCard({ 
    ticket, 
    currentUserId, 
    currentUserRole, 
    statuses 
}: { 
    ticket: TicketCardTicket, 
    currentUserId: string, 
    currentUserRole: number, 
    statuses: TicketCardStatus[] 
}) {
    const [open, setOpen] = useState(false);
    const [statusOpen, setStatusOpen] = useState(false);
    const [processingUser, setProcessingUser] = useState<string | null>(ticket.processing_user);
    const [adminComment, setAdminComment] = useState<string>(ticket.adminOrManagerComment?.text ?? "");
    const [adminCommentSaving, setAdminCommentSaving] = useState(false);
    const [adminCommentError, setAdminCommentError] = useState<string | null>(null);
    const [adminCommentSavedOpen, setAdminCommentSavedOpen] = useState(false);
    const [focusAdminComment, setFocusAdminComment] = useState(false);
    const adminCommentInputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleStatusOpen = () => setStatusOpen(true);
    const handleStatusClose = () => setStatusOpen(false);

    const handleStatusChange = async (statusId: number) => {
        await updateTicketStatus(ticket.ticket_id, statusId);
        handleStatusClose();
    };

    const isPrivileged = currentUserRole === 1 || currentUserRole === 2;
    const isAssignedToMe = processingUser === currentUserId;
    const isAssignedToOther = !!processingUser && processingUser !== currentUserId;
    const canEditAdminComment = isPrivileged && isAssignedToMe;

    useEffect(() => {
        if (open && canEditAdminComment && focusAdminComment) {
            adminCommentInputRef.current?.focus();
            setFocusAdminComment(false);
        }
    }, [open, canEditAdminComment, focusAdminComment]);

    const handleSaveAdminComment = async () => {
        const normalized = adminComment.trim();
        if (!normalized.length) {
            setAdminCommentError("Comment cannot be empty.");
            return;
        }

        setAdminCommentSaving(true);
        setAdminCommentError(null);
        try {
            const res = await updateTicketAdminComment(ticket.ticket_id, normalized);
            if (!res?.success) {
                setAdminCommentError(res?.error ?? "Failed to update admin comment.");
                return;
            }

            setAdminCommentSavedOpen(true);
        } finally {
            setAdminCommentSaving(false);
        }
    };

    function getStatusChipColor(statusName: string | undefined) {
        switch (statusName) {
            case "Open":
                return "warning" as const;
            case "In Progress":
                return "info" as const;
            case "Resolved":
                return "success" as const;
            case "Rejected":
                return "error" as const;
            default:
                return "default" as const;
        }
    }

    function getPriorityChipColor(priorityType: string | undefined) {
        switch (priorityType?.toLowerCase()) {
            case "high":
                return "error" as const;
            case "medium":
                return "warning" as const;
            case "low":
                return "success" as const;
            default:
                return "default" as const;
        }
    }

    const statusName = ticket.status_ticket_statusTostatus?.status_name;
    const isClosed = statusName ? ["Resolved", "Rejected"].includes(statusName) : false;

    return (
        <>
            <Card 
                variant="outlined"
                sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2,
                    bgcolor: (theme) =>
                        isClosed
                            ? alpha(theme.palette.text.primary, theme.palette.mode === "dark" ? 0.08 : 0.04)
                            : theme.palette.background.paper,
                    transition: (theme) => theme.transitions.create(["transform", "box-shadow", "background-color"]),
                    "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: (theme) => theme.shadows[2],
                    },
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
                            color={getStatusChipColor(ticket.status_ticket_statusTostatus?.status_name)}
                            variant="filled"
                            sx={{ 
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
                            color={getPriorityChipColor(ticket.priority_ticket_priorityTopriority?.priority_type)}
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
                                isAssignedToMe={isAssignedToMe}
                                isAssignedToOther={isAssignedToOther}
                                onAssignedToMe={() => {
                                    setProcessingUser(currentUserId);
                                    setOpen(true);
                                    setFocusAdminComment(true);
                                }}
                                onUnassigned={() => {
                                    setProcessingUser(null);
                                }}
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
                            whiteSpace: "pre-wrap",
                            overflowWrap: "anywhere",
                            wordBreak: "break-word",
                        }}
                    >
                        {ticket.description_ticket_descriptionTodescription?.description}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                    >
                        Admin/Manager comment
                    </Typography>

                    {canEditAdminComment ? (
                        <Stack spacing={1}>
                            <TextField
                                value={adminComment}
                                onChange={(e) => setAdminComment(e.target.value)}
                                placeholder="Write a note visible to the user..."
                                fullWidth
                                multiline
                                minRows={3}
                                disabled={adminCommentSaving}
                                inputRef={adminCommentInputRef}
                            />
                            {adminCommentError && (
                                <Typography variant="body2" color="error">
                                    {adminCommentError}
                                </Typography>
                            )}
                            <Box display="flex" justifyContent="flex-end" gap={1}>
                                <Button
                                    variant="contained"
                                    onClick={handleSaveAdminComment}
                                    disabled={adminCommentSaving || !adminComment.trim().length}
                                >
                                    {adminCommentSaving ? "Saving..." : "Save comment"}
                                </Button>
                            </Box>
                        </Stack>
                    ) : (
                        <Stack spacing={0.5}>
                            <Typography
                                variant="body1"
                                sx={{
                                    whiteSpace: "pre-wrap",
                                    overflowWrap: "anywhere",
                                    wordBreak: "break-word",
                                }}
                            >
                                {ticket.adminOrManagerComment?.text?.trim()?.length
                                    ? ticket.adminOrManagerComment.text
                                    : "No comment yet."}
                            </Typography>
                            {isPrivileged && !isAssignedToMe && (
                                <Typography variant="body2" color="text.secondary">
                                    Assign the ticket to yourself to add or edit a comment.
                                </Typography>
                            )}
                        </Stack>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={adminCommentSavedOpen}
                autoHideDuration={2500}
                onClose={() => setAdminCommentSavedOpen(false)}
            >
                <Alert
                    onClose={() => setAdminCommentSavedOpen(false)}
                    severity="success"
                    sx={{ width: "100%" }}
                >
                    Comment saved.
                </Alert>
            </Snackbar>

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