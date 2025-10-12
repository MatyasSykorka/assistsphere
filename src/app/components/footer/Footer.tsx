import { Typography } from "@mui/material";

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
                    © 2024 My Company
                </Typography>
            </footer>
        </>
    );
}