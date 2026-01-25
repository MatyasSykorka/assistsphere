import Header from "@/app/components/header/Header";
import { prisma } from "@/lib/prisma";
import { Box } from "@mui/material";
import AdminForms from "./AdminForms";

export default async function AdminPanel() {
    const floors = await prisma.floor.findMany({
        orderBy: { floor_id: "asc" },
        select: { floor_id: true, floor_name: true },
    });

    const roomTypes = await prisma.room_type.findMany({
        orderBy: { room_type_id: "asc" },
        select: { room_type_id: true, room_type_name: true },
    });

    const rooms = await prisma.room.findMany({
        orderBy: { room_id: "asc" },
        select: {
            room_id: true,
            name: true,
            floor_room_floorTofloor: { select: { floor_id: true, floor_name: true } },
            room_type_room_room_typeToroom_type: { select: { room_type_id: true, room_type_name: true } },
        },
    });

    return (
        <>
            <Header
                title="Admin Panel"
                subtitle="Add new rooms, room types and floors."
            />

            <Box 
                sx={{ 
                    mt: 4,
                    mb: 8,
                }} 
            >
                <AdminForms 
                    floors={floors} 
                    roomTypes={roomTypes} 
                    rooms={rooms}
                />
            </Box>
        </>
    );
} 