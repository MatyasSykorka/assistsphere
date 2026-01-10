// Next.js components
// import Link from "next/link";

// import custom components
// page.tsx
import Header from "@/app/components/header/Header";
import TicketForm from "@/app/components/(ticketComponents)/ticketForm/TicketForm";
// Importujte singleton instanci, ne třídu
import { prisma } from "@/lib/prisma"; 

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
            <article style={{ width: "50vw" }}>
                <TicketForm 
                    rooms={rooms} 
                    categories={categories} 
                    priorities={priorities} 
                />
            </article>
        </>
    );
}