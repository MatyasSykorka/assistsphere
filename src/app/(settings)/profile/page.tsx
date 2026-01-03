// Next.js components
// import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// MUI component list
import {
    Typography,
    Container,
    Button,
    Box
} from "@mui/material";

// MUI color imports
import { cyan } from '@mui/material/colors';

// import prisma client
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// import custom components
import Header from "@/app/components/header/Header";
import ProfileSecTxt from "@/app/components/profileTxt/ProfileSecTxt";
import ProfileTxt from "@/app/components/profileTxt/ProfileTxt";

import AddPhoneNumber from "@/app/components/modals/AddPhoneNumber";

// Profile settings page component
export default async function Profile() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        redirect("/");
    }

    const User = await prisma.user.findUnique({
        where: {
            id: session.user.id
        },
        include: {
            ticket_ticket_reported_userToUser: true,
            ticket_ticket_processing_userToUser: true,
            ticket_attachments: true,
        }
    });

    // Statistika
    const stats = {
        reportedTickets: User?.ticket_ticket_reported_userToUser.length ?? 0,
        processedTickets: User?.ticket_ticket_processing_userToUser.length ?? 0
    };

    return (
        <>
            <Header
                title="Profile settings"
                subtitle="Manage your profile information and preferences."
            />
            <article>
                <Typography
                    variant="h3"
                    style={{ 
                        marginTop: "0.5rem",
                        fontWeight: "bold" 
                    }}
                >
                    {User?.name ?? "displayUsername"}
                </Typography>
                <Container
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                        marginTop: "2rem",
                        backgroundColor: "#f5f5f5",
                        padding: "1rem",
                        borderRadius: "1.5rem",
                        width: "50vw",
                        alignSelf: "center",
                        marginBottom: "6vh"
                    }}
                >
                    {
                        /*
                        <ProfileSecTxt
                            params={Promise.resolve({ SecTxt: "User Information" })}
                        />
                        */
                    }
                    <ProfileSecTxt
                        params={Promise.resolve({ SecTxt: "Name:" })}
                    />
                    <ProfileTxt
                        params={Promise.resolve({ UserInfo: `${User?.name ?? "displayName"}` })}
                    />
                    <ProfileSecTxt
                        params={Promise.resolve({ SecTxt: "Email:" })}
                    />
                    <ProfileTxt
                        params={Promise.resolve({ UserInfo: `${User?.email ?? "displayEmail"}` })}
                    />
                    <ProfileSecTxt
                        params={Promise.resolve({ SecTxt: "Phone number:" })}
                    />
                    <ProfileTxt
                        params={Promise.resolve({ UserInfo: `${User?.phone_number ?? "displayPhoneNum"}` })}
                    />
                    <Box
                        sx={{
                            marginTop: "2rem",
                            padding: "1rem",
                            borderRadius: "1rem",
                            backgroundColor: `${cyan[300]}`
                        }}
                    >
                        <Typography 
                            variant="h5" 
                            fontWeight="bold"
                        >
                            User statistics:
                        </Typography>
                        <Typography>
                            Počet nahlášených ticketů: {stats.reportedTickets}
                        </Typography>
                        <Typography>
                            Počet zpracovaných ticketů: {stats.processedTickets}
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            gap: "1vw",
                            marginTop: "1rem",
                            Width: "38vw",
                            justifyContent: "center",
                            alignSelf: "center",
                            backgroundColor: "#e9e9e9ff",
                            padding: "1rem",
                            borderRadius: "1rem"
                        }}
                    >
                        <Button>
                            Change password
                        </Button>
                        <Button>
                            Change email
                        </Button>
                        <AddPhoneNumber currentPhoneNumber={User?.phone_number} />
                    </Box>
                    <Button
                        variant="outlined"
                        color="error"
                        sx={{
                            width: "15vw",
                            alignSelf: "center",
                            marginTop: "0.5rem",
                        }}
                    >
                        Delete account
                    </Button>
                </Container>
            </article>
        </>
    );
}
