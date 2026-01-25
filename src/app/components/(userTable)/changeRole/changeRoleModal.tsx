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
    MenuItem,
    FormControl
} from "@mui/material";

import { useRouter } from "next/navigation";

import { SelectChangeEvent } from "@mui/material/Select";

import { Prisma } from '@prisma/client';

type userWithRole = {
    include: { role_rel: true }
};

import { updateUserRole } from "@/app/components/(userTable)/changeRole/updateUserRole";

type User = Prisma.UserGetPayload<userWithRole>;

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
    const [role, setRole] = React.useState<string>("");
    const router = useRouter();

    React.useEffect(() => {
        if (user?.role_rel?.role_id) {
            setRole(String(user.role_rel.role_id));
        } else {
            setRole("");
        }
    }, [user]);

    if (!user) {
        return null;
    }

    const handleChange = (event: SelectChangeEvent<string>) => {
        setRole(event.target.value);
    };

    const handleConfirm = async () => {
        if (user && role) {
            await updateUserRole(user.id, Number(role));
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
            <DialogTitle>Change role for {user.name}</DialogTitle>
            <DialogContent>
                <Typography>
                    Current role: {user.role_rel?.role_name ?? "N/A"}
                </Typography>
                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel 
                        id="role-select-label"
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
                        {roles.filter(r => r.role_name !== "Administrator").map(r => (
                            <MenuItem key={r.role_id} value={String(r.role_id)}>
                                {r.role_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
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