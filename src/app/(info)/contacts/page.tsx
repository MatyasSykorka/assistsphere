// MUI components
import { Typography } from "@mui/material";

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
            <article
                style={{
                    width: "50vw",
                }}
            >
                <Typography
                    variant="h5"
                >
                    For inquiries, support, or feedback, please reach out to me at:
                </Typography>
                <Typography
                    variant="h6"
                    style={{ marginTop: "1rem" }}
                >
                    Email:
                    <Link
                        href="mailto:sykoramatyas@outlook.cz"
                    >
                        <Typography
                            variant="body1"
                        >
                            sykoramatyas@outlook.cz
                        </Typography>
                    </Link>
                </Typography>
                <Typography
                    variant="h6"
                    style={{ marginTop: "1rem" }}
                >
                    LinkedIn:
                    <Link
                        href="https://www.linkedin.com/in/maty%C3%A1%C5%A1-s%C3%BDkora-090a4b2a4"
                    >
                        <Typography
                            variant="body1"
                        >
                            Matyáš Sýkora
                        </Typography>
                    </Link>
                </Typography>
            </article>
        </>
    );
}