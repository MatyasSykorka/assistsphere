'use client'

import { useState } from 'react';
import { Button, Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { assignTicket, unassignTicket } from '@/app/tickets/actions';

interface AssignTicketButtonProps {
    ticketId: number;
    currentUserId: string;
    isAssigned: boolean;
}

export default function AssignTicketButton(
    { 
        ticketId, 
        currentUserId, 
        isAssigned 
    }: AssignTicketButtonProps
) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAssign = async () => {
        setLoading(true);
        try {
            const result = isAssigned 
                ? await unassignTicket(ticketId)
                : await assignTicket(ticketId, currentUserId);

            if (!result.success) {
                setError(
                    result.error || (
                        isAssigned ? 'Failed to unassign ticket' : 'Failed to assign ticket'
                    )
                );
            }
        } 
        catch (err) {
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
                color={isAssigned ? "error" : "primary"}
                fullWidth
                onClick={handleAssign}
                disabled={loading}
            >
                {loading ? (isAssigned ? 'Unassigning...' : 'Assigning...') : (isAssigned ? 'Unassign' : 'Assign to Me')}
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