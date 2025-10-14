// Next.js components
// import Link from "next/link";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";

// Users page component
export default function Users() {
    return (
        <>
            <Header
                title="Users"
                subtitle="Manage user accounts and permissions."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can view and manage all user accounts, including roles and permissions.
                </Typography>
            </article>
        </>
    );
}