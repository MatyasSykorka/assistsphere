// Next.js components
// import Link from "next/link";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";

// My Tickets page component
export default function MyTickets() {
    return (
        <>
            <Header
                title="My Tickets"
                subtitle="View and manage your reported tickets."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can view and manage all tickets you have submitted.
                </Typography>
            </article>
        </>
    );
}