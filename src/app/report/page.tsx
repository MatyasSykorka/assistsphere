// Next.js components
// import Link from "next/link";

// MUI components
import { Typography } from "@mui/material";

// import custom components
import Header from "@/app/components/header/Header";

export default function Report() {
    return (
        <>
            <Header
                title="Report an issue"
                subtitle="Submit a report ticket for assistance."
            />
            <article
                style={{
                    width: "50vw"
                }}
            >
                <Typography
                    variant="h5"
                >
                    To submit a report ticket, please log in to your account and navigate to the report section.
                </Typography>
            </article>
        </>
    );
}