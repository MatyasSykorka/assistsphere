// Next.js components
import Link from "next/link";

// MUI components
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
/*
// Or you can make array of imports like this if needed
import {
    Button,
    Typography
} from "@mui/material";
*/

// import custom components
import Header from "@/app/components/header/Header";

// Home page component
export default function Home() {
    return (
        <>
            <Header
                title="Welcome to AssistSphere"
                subtitle="Your solution for all assistance needs."
            />
            <main>
                <Typography
                    variant="h4"
                >
                    To sand a report ticket, please log in with...
                </Typography>
            </main>
            <menu>
                <Button
                    href="/login"
                    component={Link}
                    variant="contained"
                    color="primary"
                    sx={{
                        marginTop: "1rem"
                    }}
                >
                    Log in
                </Button>
            </menu>
        </>
    );
}
