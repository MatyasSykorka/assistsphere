// MUI components
import { Typography } from "@mui/material";

// Footer component
export default function Footer() {
    return (
        <>
            <footer
                style={{
                    position: "fixed",
                    left: 0,
                    bottom: 0,
                    width: "100vw",
                    padding: "1rem 0",
                    borderTop: "1px solid #ccc",
                    background: "#fff",
                    zIndex: 100,
                    textAlign: "center"
                }}
            >
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                >
                    &copy; 2025 AssistSphare
                </Typography>
            </footer>
        </>
    );
}