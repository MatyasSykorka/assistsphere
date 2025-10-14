// Next.js components
// import Link from "next/link";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";

// Profile settings page component
export default function Profile() {
    return (
        <>
            <Header
                title="Profile settings"
                subtitle="Manage your profile information and preferences."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can update your profile information, change your password, and adjust your preferences.
                </Typography>
            </article>
        </>
    );
}