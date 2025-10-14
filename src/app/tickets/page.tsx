// Next.js components
// import Link from "next/link";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";

// Tickets page component
export default function Tickets() {
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
        </>
    );
}