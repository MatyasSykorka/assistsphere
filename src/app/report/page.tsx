// Next.js components
// import Link from "next/link";

// import custom components
// page.tsx
import Header from "@/app/components/header/Header";
import TicketForm from "@/app/components/(ticketComponents)/ticketForm/TicketForm";
// Importujte singleton instanci, ne třídu
import { prisma } from "@/lib/prisma"; 
// MUI components
import { Box } from "@mui/material";

export default async function Report() {
    // [cite: 12, 14, 15]
    const rooms = await prisma.room.findMany();
    const categories = await prisma.category.findMany();
    const priorities = await prisma.priority.findMany();

    return (
        <>
            <Header
                title="Report an issue"
                subtitle="Submit a report ticket for assistance."
            />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <Box
                        component="article"
                        sx={{
                            width: "100%",
                            maxWidth: 760,
                            pb: 10,
                        }}
                    >
                        <TicketForm 
                            rooms={rooms} 
                            categories={categories} 
                            priorities={priorities} 
                        />
                    </Box>
                </Box>
        </>
    );
}