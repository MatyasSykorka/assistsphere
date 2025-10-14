// Next.js components
// import Link from "next/link";

// MUI components
import Typography from "@mui/material/Typography";

// import custom components
import Header from "@/app/components/header/Header";

// Settings page component
export default function Settings() {
    return (
        <>
            <Header
                title="App settings"
                subtitle="Manage app preferences."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can adjust dark mode and other application settings.
                </Typography>
            </article>
        </>
    );
}