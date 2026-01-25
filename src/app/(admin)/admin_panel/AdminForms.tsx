'use client'

import { 
    useMemo, 
    useState 
} from "react";
import {
    Alert,
    Box,
    Button,
    Divider,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Paper,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { 
    createFloor, 
    createRoom, 
    createRoomType, 
    deleteFloor, 
    deleteRoom, 
    deleteRoomType 
} from "./actions";

export type FloorOption = {
    floor_id: number;
    floor_name: string;
};

export type RoomTypeOption = {
    room_type_id: number;
    room_type_name: string;
};

export type RoomOption = {
    room_id: number;
    name: string;
    floor_room_floorTofloor?: {
        floor_id: number;
        floor_name: string;
    } | null;
    room_type_room_room_typeToroom_type?: {
        room_type_id: number;
        room_type_name: string;
    } | null;
};

export default function AdminForms(props: {
    floors: FloorOption[];
    roomTypes: RoomTypeOption[];
    rooms: RoomOption[];
}) {
    const router = useRouter();

    const [floorName, setFloorName] = useState("");
    const [roomTypeName, setRoomTypeName] = useState("");

    const [roomName, setRoomName] = useState("");
    const [floorId, setFloorId] = useState<number | "">("");
    const [roomTypeId, setRoomTypeId] = useState<number | "">("");

    const [loading, setLoading] = useState<"floor" | "roomType" | "room" | "delete" | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [pendingDelete, setPendingDelete] = useState<
        | { 
            kind: "floor"; 
            id: number; 
            name: string 
        }
        | { 
            kind: "roomType"; 
            id: number; 
            name: string 
        }
        | { 
            kind: "room"; 
            id: number; 
            name: string 
        } | null
    >(null);

    const floorMenu = useMemo(() => props.floors, [props.floors]);
    const roomTypeMenu = useMemo(() => props.roomTypes, [props.roomTypes]);
    const rooms = useMemo(() => props.rooms, [props.rooms]);

    const closeSnackbars = () => {
        setError(null);
        setSuccess(null);
    };

    const openDeleteDialog = (item: NonNullable<typeof pendingDelete>) => {
        setPendingDelete(item);
        setConfirmOpen(true);
    };

    const closeDeleteDialog = () => {
        if (loading === "delete") return;
        setConfirmOpen(false);
        setPendingDelete(null);
    };

    const handleCreateFloor = async () => {
        if (!floorName.trim()) {
            setError("Please enter a floor name.");
            return;
        }

        setLoading("floor");
        try {
            const result = await createFloor(floorName);
            if (!result.success) {
                setError(result.error ?? "Failed to create floor.");
                return;
            }
            setFloorName("");
            setSuccess("Floor was created.");
            router.refresh();
        } 
        catch {
            setError("An unexpected error occurred.");
        } 
        finally {
            setLoading(null);
        }
    };

    const handleCreateRoomType = async () => {
        if (!roomTypeName.trim()) {
            setError("Please enter a room type name.");
            return;
        }

        setLoading("roomType");
        try {
            const result = await createRoomType(roomTypeName);
            if (!result.success) {
                setError(result.error ?? "Failed to create room type.");
                return;
            }
            setRoomTypeName("");
            setSuccess("Room type was created.");
            router.refresh();
        } 
        catch {
            setError("An unexpected error occurred.");
        } 
        finally {
            setLoading(null);
        }
    };

    const handleCreateRoom = async () => {
        if (!roomName.trim()) {
            setError("Please enter a room name.");
            return;
        }

        setLoading("room");
        try {
            if (floorId === "" || roomTypeId === "") {
                setError("Select a floor and a room type.");
                return;
            }

            const result = await createRoom({
                name: roomName,
                floorId,
                roomTypeId,
            });

            if (!result.success) {
                setError(result.error ?? "Failed to create room.");
                return;
            }

            setRoomName("");
            setSuccess("Room was created.");
            router.refresh();
        } 
        catch {
            setError("An unexpected error occurred.");
        } 
        finally {
            setLoading(null);
        }
    };

    const handleConfirmDelete = async () => {
        if (!pendingDelete) return;

        setLoading("delete");
        try {
            const result =
                pendingDelete.kind === "floor" ? 
                    await deleteFloor(pendingDelete.id) : 
                    pendingDelete.kind === "roomType" ? 
                        await deleteRoomType(pendingDelete.id) : 
                        await deleteRoom(pendingDelete.id);

            if (!result.success) {
                const fallback =
                    pendingDelete.kind === "floor" ? 
                        "Failed to delete floor." : 
                        pendingDelete.kind === "roomType" ? 
                            "Failed to delete room type." : 
                            "Failed to delete room.";

                setError(result.error ?? fallback);
                return;
            }

            const okMsg =
                pendingDelete.kind === "floor" ? 
                    "Floor was deleted." : 
                    pendingDelete.kind === "roomType" ? 
                        "Room type was deleted." : 
                        "Room was deleted.";

            setSuccess(okMsg);
            setConfirmOpen(false);
            setPendingDelete(null);
            router.refresh();
        } 
        catch {
            setError("An unexpected error occurred.");
        } 
        finally {
            setLoading(null);
        }
    };

    return (
        <Stack 
            spacing={3} 
            sx={{ 
                mt: 3 
            }}
        >
            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    borderRadius: 2 
                }}
            >
                <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                >
                    Add new floor
                </Typography>
                <Stack 
                    direction={{ 
                        xs: "column", 
                        sm: "row" 
                    }} 
                    spacing={2}
                >
                    <TextField
                        label="Floor name"
                        value={floorName}
                        onChange={
                            (e) => setFloorName(e.target.value)
                        }
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleCreateFloor}
                        disabled={loading === "floor"}
                        sx={{ 
                            inWidth: 160 
                        }}
                    >
                        {loading === "floor" ? 
                            "Saving..." : 
                            "Add"
                        }
                    </Button>
                </Stack>
            </Paper>

            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    borderRadius: 2 
                }}
            >
                <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                >
                    Add room type
                </Typography>
                <Stack 
                    direction={{ 
                        xs: "column", 
                        sm: "row" 
                    }} 
                    spacing={2}
                >
                    <TextField
                        label="Type name"
                        value={roomTypeName}
                        onChange={
                            (e) => setRoomTypeName(e.target.value)
                        }
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        onClick={handleCreateRoomType}
                        disabled={loading === "roomType"}
                        sx={{ 
                            minWidth: 160 
                        }}
                    >
                        {loading === "roomType" ? 
                            "Saving..." : 
                            "Add"
                        }
                    </Button>
                </Stack>
            </Paper>

            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    borderRadius: 2 
                }}
            >
                <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                >
                    Add room
                </Typography>

                <Stack 
                    spacing={2}
                >
                    <TextField
                        label="Room name"
                        value={roomName}
                        onChange={
                            (e) => setRoomName(e.target.value)
                        }
                        fullWidth
                    />

                    <Stack 
                        direction={{ 
                            xs: "column", 
                            sm: "row" 
                        }} 
                        spacing={2}
                    >
                        <TextField
                            select
                            label="Floor"
                            value={floorId}
                            onChange={
                                (e) => setFloorId(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            fullWidth
                        >
                            {floorMenu.length === 0 ? (
                                <MenuItem 
                                    value="" 
                                    disabled
                                >
                                    No floors available
                                </MenuItem>
                            ) : (
                                floorMenu.map((f) => (
                                    <MenuItem 
                                        key={f.floor_id} 
                                        value={f.floor_id}
                                    >
                                        {f.floor_name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>

                        <TextField
                            select
                            label="Room type"
                            value={roomTypeId}
                            onChange={
                                (e) => setRoomTypeId(e.target.value === "" ? "" : Number(e.target.value))
                            }
                            fullWidth
                        >
                            {roomTypeMenu.length === 0 ? (
                                <MenuItem 
                                    value="" 
                                    disabled
                                >
                                    No room types available
                                </MenuItem>
                            ) : (
                                roomTypeMenu.map((t) => (
                                    <MenuItem 
                                        key={t.room_type_id} 
                                        value={t.room_type_id}
                                    >
                                        {t.room_type_name}
                                    </MenuItem>
                                ))
                            )}
                        </TextField>
                    </Stack>

                    <Divider />

                    <Box 
                        display="flex" 
                        justifyContent="flex-end"
                    >
                        <Button
                            variant="contained"
                            onClick={handleCreateRoom}
                            disabled={loading === "room"}
                            sx={{ minWidth: 160 }}
                        >
                            {loading === "room" ? 
                                "Saving..." : 
                                "Add room"
                            }
                        </Button>
                    </Box>
                </Stack>
            </Paper>

            <Paper 
                elevation={3} 
                sx={{ 
                    p: 3, 
                    borderRadius: 2 
                }}
            >
                <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    gutterBottom
                >
                    Managing existing items
                </Typography>

                <Typography 
                    variant="subtitle2" 
                    color="text.secondary" 
                    sx={{ 
                        mt: 1 
                    }}
                >
                    Floors
                </Typography>
                <List dense>
                    {floorMenu.length === 0 ? (
                        <ListItem>
                            <ListItemText 
                                primary="No floors" 
                            />
                        </ListItem>
                    ) : (
                        floorMenu.map((f) => (
                            <ListItem
                                key={f.floor_id}
                                secondaryAction={
                                    <Button
                                        color="error"
                                        onClick={
                                            () => openDeleteDialog({ 
                                                kind: "floor", 
                                                id: f.floor_id, 
                                                name: f.floor_name 
                                            })
                                        }
                                        disabled={loading === "delete"}
                                    >
                                        Delete
                                    </Button>
                                }
                            >
                                <ListItemText 
                                    primary={f.floor_name} 
                                />
                            </ListItem>
                        ))
                    )}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                >
                    Room types
                </Typography>
                <List dense>
                    {roomTypeMenu.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No room types" />
                        </ListItem>
                    ) : (
                        roomTypeMenu.map((t) => (
                            <ListItem
                                key={t.room_type_id}
                                secondaryAction={
                                    <Button
                                        color="error"
                                        onClick={
                                            () => openDeleteDialog({ 
                                                kind: "roomType", 
                                                id: t.room_type_id, 
                                                name: t.room_type_name 
                                            })
                                        }
                                        disabled={loading === "delete"}
                                    >
                                        Delete
                                    </Button>
                                }
                            >
                                <ListItemText primary={t.room_type_name} />
                            </ListItem>
                        ))
                    )}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography 
                    variant="subtitle2" 
                    color="text.secondary"
                >
                    Rooms
                </Typography>
                <List dense>
                    {rooms.length === 0 ? (
                        <ListItem>
                            <ListItemText primary="No rooms" />
                        </ListItem>
                    ) : (
                        rooms.map((r) => (
                            <ListItem
                                key={r.room_id}
                                secondaryAction={
                                    <Button
                                        color="error"
                                        onClick={
                                            () => openDeleteDialog({ 
                                                kind: "room", 
                                                id: r.room_id, 
                                                name: r.name 
                                            })
                                        }
                                        disabled={loading === "delete"}
                                    >
                                        Delete
                                    </Button>
                                }
                            >
                                <ListItemText
                                    primary={r.name}
                                    secondary={`${r.floor_room_floorTofloor?.floor_name ?? "?"} • ${r.room_type_room_room_typeToroom_type?.room_type_name ?? "?"}`}
                                />
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>

            <Dialog
                open={confirmOpen}
                onClose={closeDeleteDialog}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogContent dividers>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        This action cannot be undone.
                    </Typography>
                    <Typography variant="body1">
                        {pendingDelete ? (
                            <>
                                Delete {pendingDelete.kind === "roomType" ? 
                                    "room type" : 
                                    pendingDelete.kind
                                } <strong>
                                    {pendingDelete.name}
                                </strong>
                                ?
                            </>
                        ) : (
                            "Are you sure you want to delete this item?"
                        )}
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={closeDeleteDialog} 
                        disabled={loading === "delete"}
                    >
                        Cancel
                    </Button>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={handleConfirmDelete}
                        disabled={loading === "delete" || !pendingDelete}
                    >
                        {loading === "delete" ? 
                            "Deleting..." : 
                            "Delete"
                        }
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar 
                open={!!error} 
                autoHideDuration={6000} 
                onClose={closeSnackbars}
            >
                <Alert 
                    onClose={closeSnackbars} 
                    severity="error" 
                    sx={{ 
                        width: "100%" 
                    }}
                >
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={!!success} 
                autoHideDuration={4000} 
                onClose={closeSnackbars}
            >
                <Alert 
                    onClose={closeSnackbars} 
                    severity="success" 
                    sx={{ 
                        width: "100%" 
                    }}
                >
                    {success}
                </Alert>
            </Snackbar>
        </Stack>
    );
}
