'use client';

import React from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Select,
    InputLabel,
    MenuItem
} from "@mui/material";

import { SelectChangeEvent } from "@mui/material/Select";

import { Prisma } from '@prisma/client';

// This creates a type based on the Prisma query from the parent page, ensuring type safety.
type userWithRole = {
    include: { role_users_roleTorole: true }
};

type User = Prisma.usersGetPayload<userWithRole>;

interface ChangeRoleModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

export default function ChangeRoleModal({ 
    open, 
    onClose, 
    user 
}: ChangeRoleModalProps) {
    const [role, setRole] = React.useState('');

    if (!user) {
        return null;
    }

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>Change role for {user.name} {user.surname}</DialogTitle>
            <DialogContent>
            <Typography>
                Current role: {user.role_users_roleTorole?.role_name ?? "N/A"}
            </Typography>
            <Typography 
                sx={{ mt: 2 }}
            >
                <InputLabel 
                    id="demo-simple-select-helper-label"
                >
                    Role
                </InputLabel>
                <Select
                    labelId="role-select-label"
                    id="role-select"
                    value={role}
                    label="Role"
                    onChange={handleChange}
                >
                    <MenuItem 
                        value={user.role_users_roleTorole?.role_id /*set administrator*/}
                    >
                        Administrator
                    </MenuItem>
                    <MenuItem 
                        value={user.role_users_roleTorole?.role_id /*set manager*/}
                    >
                        Manager
                    </MenuItem>
                    <MenuItem 
                        value={user.role_users_roleTorole?.role_id /*set reporter*/}
                    >
                        Reporter
                    </MenuItem>
                </Select>
            </Typography>
            </DialogContent>
            <DialogActions>
            <Button onClick={onClose}>
                Cancel
            </Button>
            <Button 
                onClick={onClose} 
                variant="contained" 
                autoFocus
            >
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
    );
}