// MUI components
import { Typography } from "@mui/material";

// Footer component
export default function Footer() {
    return (
        <>
            <footer
                style={{
                    marginTop: "2rem",
                    padding: "1rem 0",
                    borderTop: "1px solid #ccc",
                }}
            >
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                >
                    © 2025 AssistSphare
                </Typography>
            </footer>
        </>
    );
}