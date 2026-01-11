'use client'

import { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { 
    assignTicket, 
    unassignTicket 
} from '@/app/tickets/actions';

interface AssignTicketButtonProps {
    ticketId: number;
    isAssignedToMe: boolean;
    isAssignedToOther: boolean;
    onAssignedToMe?: () => void;
    onUnassigned?: () => void;
}

export default function AssignTicketButton(
    { 
        ticketId, 
        isAssignedToMe,
        isAssignedToOther,
        onAssignedToMe,
        onUnassigned,
    }: AssignTicketButtonProps
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAssign = async () => {
        setLoading(true);
        try {
            const result = isAssignedToMe 
                ? await unassignTicket(ticketId)
                : await assignTicket(ticketId);

            if (!result.success) {
                setError(
                    result.error || (
                        isAssignedToMe ? 
                            "Failed to unassign ticket" : 
                            "Failed to assign ticket"
                    )
                );
            } else {
                if (isAssignedToMe) {
                    onUnassigned?.();
                } else {
                    onAssignedToMe?.();
                }
            }
        } 
        catch {
            setError('An unexpected error occurred');
        } 
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Button 
                variant="contained" 
                color={isAssignedToMe ? "error" : "primary"}
                fullWidth
                onClick={handleAssign}
                disabled={loading || (!isAssignedToMe && isAssignedToOther)}
            >
                {loading ? 
                    (
                        isAssignedToMe ? 
                            "Unassigning..." : 
                            "Assigning..."
                    ) : (
                        isAssignedToMe ? 
                            "Unassign" : 
                            (isAssignedToOther ? "Assigned" : "Assign to Me")
                    )
                }
            </Button>
            {error && (
                <Snackbar 
                    open={!!error} 
                    autoHideDuration={6000} 
                    onClose={
                        () => setError(null)
                    }
                >
                    <Alert 
                        onClose={
                            () => setError(null)
                        } 
                        severity="error" 
                        sx={{ 
                            width: '100%' 
                        }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            )}
        </>
    );
}