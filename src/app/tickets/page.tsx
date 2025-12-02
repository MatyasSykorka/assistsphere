// Next.js components
// import Link from "next/link";
import { prisma } from "@/lib/prisma";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";
import { Container, Box } from "@mui/material";

// Tickets page component
export default async function Tickets() {
    const tickets = await prisma.ticket.findMany({
        include: {
            description_ticket_descriptionTodescription: true
        }
    });


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
                    Here you can view and manage all support tickets submitted by users.
                </Typography>
            </article>
            <Container>
                <Box>
                    {tickets.map((ticket) => (
                        <Box 
                            key={ticket.ticket_id} 
                            sx={{ 
                                mb: 2, 
                                p: 2, 
                                border: '1px solid #ccc', 
                                borderRadius: '8px' 
                            }}
                        >
                            <Typography variant="h6">
                                Ticket ID: {ticket.ticket_id}
                            </Typography>
                            <Typography variant="body1">
                                Subject: {ticket.ticket_title}
                            </Typography>
                            <Typography variant="body2">
                                Status: {ticket.status}
                            </Typography>
                            <Typography key={ ticket.ticket_id } variant="body2">
                                Ticket description:&nbsp;
                                <span>
                                    {ticket.description_ticket_descriptionTodescription?.description}
                                </span>
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </>
    );
}