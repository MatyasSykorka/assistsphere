// MUI components
import { Typography } from "@mui/material";

// Header component props
type HeaderProps = {
    title?: string;
    subtitle?: string; // volitelný prop
};

// Header component
export default function Header( 
    { title, subtitle } : HeaderProps 
) {
    return (
        <header
            style={{
                textAlign: "center",
            }}
        >
            <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
                align="center"
                sx={{
                    marginTop: "3vh",
                    fontWeight: "bold"
                }}
            >
                { title || "AssistSphere" }
            </Typography>
            <Typography 
                variant="h4" 
                component="h2" 
                color="text.secondary"
                align="center"
                sx={{
                    marginBottom: "5vh"
                }}
            >
                { subtitle || "Your solution for all assistance needs." }
            </Typography>
        </header>
    );
}