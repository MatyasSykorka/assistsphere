'use client';

import React from "react";
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    InputAdornment,
    IconButton,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useRouter } from "next/navigation";
import { SelectChangeEvent } from "@mui/material/Select";

import { createUser } from "@/app/components/(userTable)/addUser/createUserAction";

interface Role {
    role_id: number;
    role_name: string;
}

interface AddUserModalProps {
    open: boolean;
    onClose: () => void;
    roles: Role[];
}

export default function AddUserModal({ 
    open, 
    onClose, 
    roles 
}: AddUserModalProps) {
    const router = useRouter();

    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [phoneNumber, setPhoneNumber] = React.useState("");
    const [roleId, setRoleId] = React.useState<string>("");
    const [password, setPassword] = React.useState("");
    const [showPassword, setShowPassword] = React.useState(false);

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    React.useEffect(() => {
        if (!open) {
            setName("");
            setEmail("");
            setPhoneNumber("");
            setRoleId("");
            setPassword("");
            setShowPassword(false);
            setLoading(false);
            setError(null);
        }
    }, [open]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleRoleChange = (event: SelectChangeEvent<string>) => {
        setRoleId(event.target.value);
    };

    const handleCreate = async () => {
        setError(null);

        if (!name.trim()) {
            setError("Name is required.");
            return;
        }

        if (!email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!password) {
            setError("Password is required.");
            return;
        }

        setLoading(true);
        try {
            await createUser({
                name,
                email,
                password,
                phone_number: phoneNumber,
                role_id: roleId === "" ? undefined : Number(roleId),
            });

            router.refresh();
            onClose();
        } 
        catch (e) {
            const message = e instanceof Error ? e.message : "Failed to create user";
            setError(message);
        } 
        finally {
            setLoading(false);
        }
    };

    const selectableRoles = roles.filter((r) => r.role_name !== "Administrator");

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Add new user</DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                    autoFocus
                />

                <TextField
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                    type="email"
                />

                <TextField
                    label="Phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                />

                <TextField
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        onMouseUp={handleMouseUpPassword}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                <FormControl fullWidth sx={{ mt: 2 }}>
                    <InputLabel id="add-user-role-label">Role</InputLabel>
                    <Select
                        labelId="add-user-role-label"
                        value={roleId}
                        label="Role"
                        onChange={handleRoleChange}
                    >
                        {selectableRoles.map((r) => (
                            <MenuItem key={r.role_id} value={String(r.role_id)}>
                                {r.role_name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button variant="outlined" onClick={onClose} disabled={loading}>
                    Cancel
                </Button>
                <Button variant="contained" onClick={handleCreate} disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
