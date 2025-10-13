// Import MUI components
import { Typography } from "@mui/material";
/*
import {
    Button,
    Link
} from "@mui/material";
*/

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
            <article
                style={{
                    width: "50vw",

                }}
            >
                <Typography
                    variant="body1"
                >
                    AssistSphere is a project developed by Matyáš Sýkora as part of his graduation thesis. The platform aims to provide comprehensive assistance solutions for various needs, leveraging modern web technologies and user-centric design principles.
                </Typography>
                <Typography
                    variant="body1"
                >
                    The project is built using Next.js and Material-UI, ensuring a responsive and accessible user experience across different devices. It incorporates features such as user authentication, real-time notifications, and an intuitive interface to facilitate seamless interactions.
                </Typography>
                <Typography
                    variant="body1"
                >
                    For more information about the project, its features, or to get in touch with the creator, please visit the&nbsp;
                    <Link
                        href="/contacts"
                    >
                        Contact page
                    </Link>
                    .
                </Typography>
                <Typography
                    variant="h6"
                >
                    You can also check out the project's repository on
                    <Link 
                        href="https://github.com/MatyasSykorka/assistsphere"
                        style={{ 
                            marginLeft: "0.5rem",
                            textDecoration: "none",
                            color: "#1976d2"
                        }}
                    >
                        GitHub
                    </Link>
                    .
                </Typography>
                <Typography
                    variant="h5"
                    style={{ 
                        marginTop: "2rem",
                        fontWeight: "bold" 
                    }}
                >
                    Thank you for your interest in AssistSphere!
                </Typography>
            </article>
        </>
    );
}
