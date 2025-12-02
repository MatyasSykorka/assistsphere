// Next.js components
// import Link from "next/link";
import { prisma } from "@/lib/prisma";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";
import { Container, Box } from "@mui/material";

// Tickets page component
export default function Tickets() {
    const tickets = prisma.ticket.findMany();

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
                <Box
                    sx={{
                        marginTop: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem"
                    }}
                >
                    {tickets.map((ticket) => (
                        <Box
                            key={ticket.id}
                            sx={{
                                padding: "1rem",
                                border: "1px solid #ccc",
                                borderRadius: "8px"
                            }}
                        >
                            <Typography variant="h6">
                                {ticket.title}
                            </Typography>
                            <Typography variant="body1">
                                {ticket.description}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                                Status: {ticket.status}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Container>
        </>
    );
}