// Import MUI components
import { Box, Container, Typography } from "@mui/material";

// Import Next.js components
import Link from "next/link";

// Import custom components
import Header from "@/app/components/header/Header";

// About page component
export default function About() {
    return (
        <>
            <Header
                title="About AssistSphere"
                subtitle="Learn more about this project."
            />
            <Container 
                maxWidth="sm"
            >
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
                    <Typography variant="body1">
                        AssistSphere is a project developed by Matyáš Sýkora as part of his maturita exams. The platform aims to provide comprehensive assistance solutions for various needs, leveraging modern web technologies and user-centric design principles.
                    </Typography>
                    <Typography variant="body1">
                        The project is built using Next.js libraries and Material-UI, ensuring a responsive and accessible user experience across different devices. It incorporates features such as user authentication and an intuitive interface to facilitate seamless interactions.
                    </Typography>
                    <Typography variant="body1">
                        For more information about the project, its features, or to get in touch with the creator, please visit the Contact page.
                    </Typography>

                    <Typography variant="h6" sx={{ mt: 1 }}>
                        You can also check out the project&apos;s repository on&nbsp;
                        <Link href="https://github.com/MatyasSykorka/assistsphere">GitHub</Link>.
                    </Typography>

                    <Typography 
                        variant="h5" 
                        sx={{ 
                            mt: 2, 
                            fontWeight: "bold" 
                        }}
                    >
                        Thank you for your interest in AssistSphere!
                    </Typography>
                </Box>
            </Container>
        </>
    );
}
