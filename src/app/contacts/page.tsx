// MUI components
import { Typography } from "@mui/material";

// Next.js components
import Link from "next/link";

// Custom components
import Header from "../components/header/Header";

// Contact page component
export default function Contact() {
    return (
        <>
            <Header
                title="Contact Us"
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
                    For inquiries, support, or feedback, please reach out to us at:
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
                    Phone:
                    <Link
                        href="tel:+420603192889"
                    >
                        <Typography
                            variant="body1"
                        >
                            +420 603 192 889
                        </Typography>
                    </Link>
                </Typography>
            </article>
        </>
    );
}