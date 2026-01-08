// Next.js components
// import Link from "next/link";
import { prisma } from "@/lib/prisma";

// MUI components
import Typography from "@mui/material/Typography";
import { 
    Container, 
    Grid
} from "@mui/material";

// import custom components
import Header from "@/app/components/header/Header";
import TicketCard from "../components/ticketTable/TicketCard";

// Tickets page component
export default async function Tickets() {
    const tickets = await prisma.ticket.findMany({
        include: {
            description_ticket_descriptionTodescription: true,
            room_ticket_roomToroom: true,
            status_ticket_statusTostatus: true,
            priority_ticket_priorityTopriority: true,
            category_ticket_categoryTocategory: true,
            user_reported: true,
            user_processing: true
        },
        orderBy: {
            created_time: 'desc'
        }
    });

    // Sort tickets: move Resolved and Rejected to the end of the list
    tickets.sort((a, b) => {
        const statusA = a.status_ticket_statusTostatus?.status_name;
        const statusB = b.status_ticket_statusTostatus?.status_name;
        const isEndA = statusA === "Resolved" || statusA === "Rejected";
        const isEndB = statusB === "Resolved" || statusB === "Rejected";

        if (isEndA && !isEndB) return 1;
        if (!isEndA && isEndB) return -1;
        return 0;
    });

    // In a real application, you would get the current user from the session
    const user = await prisma.user.findFirst();
    const currentUserId = user?.id || "";

    const statuses = await prisma.status.findMany();

    return (
        <>
            <Header
                title="Tickets"
                subtitle="View and manage support tickets."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can view and manage all reported tickets submitted by users.
                </Typography>
            </article>
            <Container
                sx={{  
                    mt: 4,
                    mb: 4,
                }}
            >
                <Grid 
                    container 
                    spacing={3}
                >
                    {tickets.map((ticket) => (
                        <Grid 
                            item 
                            sx={{ width: 350 }}
                            key={ticket.ticket_id}
                        >
                            <TicketCard 
                                ticket={{
                                    ...ticket,
                                    created_time: ticket.created_time.toISOString()
                                }} 
                                currentUserId={currentUserId}
                                statuses={statuses}
                            />
                            
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}