import { Typography } from "@mui/material";

type HeaderProps = {
    title?: string;
    subtitle?: string; // volitelný prop
};


export default function Header( { title, subtitle } : HeaderProps ) {
    return (
        <header>
            <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom
            >
                { title || "AssistSphere" }
            </Typography>
            <Typography 
                variant="h4" 
                component="h2" 
                color="textSecondary"
                sx={{
                    marginBottom: "8vh"
                }}
            >
                { subtitle || "Your solution for all assistance needs." }
            </Typography>
        </header>
    );
}