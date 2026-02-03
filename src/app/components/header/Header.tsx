// MUI components
import { Typography } from "@mui/material";

// Header component props
type HeaderProps = {
    title?: string;
    subtitle?: string; // volitelný prop
    dense?: boolean;
};

// Header component
export default function Header( 
    { title, subtitle, dense = false } : HeaderProps 
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
                    mt: dense ? 0 : "3vh",
                    fontWeight: "bold",
                    fontSize: { xs: "2.2rem", sm: "3rem" },
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
                    mb: dense ? 0 : "5vh",
                    fontSize: { xs: "1.25rem", sm: "1.75rem" },
                }}
            >
                { subtitle || "Your solution for all assistance needs." }
            </Typography>
        </header>
    );
}