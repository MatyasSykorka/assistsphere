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

import { useRouter } from "next/navigation";
import { updateUserRole } from "@/app/actions/updateUserRole";

import { SelectChangeEvent } from "@mui/material/Select";

import { Prisma } from '@prisma/client';

type userWithRole = {
    include: { role_users_roleTorole: true }
};

type User = Prisma.usersGetPayload<userWithRole>;

interface ChangeRoleModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
    roles: { 
        role_id: number, 
        role_name: string 
    }[];
}

export default function ChangeRoleModal({ 
    open, 
    onClose, 
    user,
    roles
}: ChangeRoleModalProps) {
    const [role, setRole] = React.useState('');
    const router = useRouter();

    if (!user) {
        return null;
    }

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value);
    };

    const handleConfirm = async () => {
        if (user && role) {
            await updateUserRole(user.user_id, Number(role));
            router.refresh();
            onClose();
        }
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
                    sx={{ 
                        mt: 2
            <Typography>
                Current role: {user.role_users_roleTorole?.role_name ?? "N/A"}
            </Typography>
            <Typography 
                sx={{ 
                    mt: 2
                }}
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
                    onChange={handleChange}
                    sx={{
                        minWidth: "10vw"
                    }}
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
                        onChange={handleChange}
                        sx={{
                            minWidth: "10vw"
                        }}
                    >
                        {roles.filter(r => r.role_name !== "Administrator").map(r => (
                            <MenuItem key={r.role_id} value={r.role_id}>
                                {r.role_name}
                            </MenuItem>
                        ))}
                    </Select>
                </Typography>
                    {roles.filter(r => r.role_name !== "Administrator").map(r => (
                        <MenuItem key={r.role_id} value={r.role_id}>
                            {r.role_name}
                        </MenuItem>
                    ))}
                </Select>
            </Typography>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={onClose}
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onClose} 
                    variant="contained" 
                    autoFocus
                >
                    Confirm
                </Button>
            <Button
                variant="outlined"
                onClick={onClose}
            >
                Cancel
            </Button>
            <Button 
                onClick={handleConfirm} 
                variant="contained" 
                autoFocus
            >
                Confirm
            </Button>
            </DialogActions>
        </Dialog>
    );
}