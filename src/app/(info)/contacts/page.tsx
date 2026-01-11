// MUI components
import { Box, Container, Typography } from "@mui/material";

// Next.js components
import Link from "next/link";

// Custom components
import Header from "../../components/header/Header";

// Contact page component
export default function Contact() {
    return (
        <>
            <Header
                title="Contact me"
                subtitle="Get in touch with the AssistSphere creator."
            />
            <Container maxWidth="sm">
                <Box
                    component="article"
                    sx={{
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 2,
                        pb: 10,
                    }}
                >
                    <Typography variant="h5">
                        For inquiries, support, or feedback, please reach out to me at:
                    </Typography>

                    <Box>
                        <Typography variant="h6">Email:</Typography>
                        <Link href="mailto:sykoramatyas@outlook.cz">
                            <Typography variant="body1">sykoramatyas@outlook.cz</Typography>
                        </Link>
                    </Box>

                    <Box>
                        <Typography variant="h6">LinkedIn:</Typography>
                        <Link href="https://www.linkedin.com/in/maty%C3%A1%C5%A1-s%C3%BDkora-090a4b2a4">
                            <Typography variant="body1">Matyáš Sýkora</Typography>
                        </Link>
                    </Box>
                </Box>
            </Container>
        </>
    );
}