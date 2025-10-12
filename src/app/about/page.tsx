// Import MUI components
import {
    Button,
    Link
} from "@mui/material";

// About page component
export default function About() {
    return (
        <>
        
            <Button
                component={Link}
                href="/"
                variant="contained"
                color="secondary"
            >
                Go Home
            </Button>
        </>
    );
}
