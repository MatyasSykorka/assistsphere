// MUI components
import { Typography } from "@mui/material";

// Footer component
export default function Footer() {
    const Year: number = new Date().getFullYear();

    return (
        <>
            <footer
                style={{
                    position: "fixed",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: "100%",
                    padding: "1rem 0",
                    borderTop: "1px solid #ccc",
                    zIndex: 100,
                    textAlign: "center",
                    backgroundColor: "#fff",
                    boxSizing: "border-box",
                }}
            >
                <Typography
                    variant="body2"
                    color="textSecondary"
                    align="center"
                >
                    &copy; { Year } AssistSphare
                </Typography>
            </footer>
        </>
    );
}