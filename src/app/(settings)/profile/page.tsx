// Next.js components
// import Link from "next/link";

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

// import custom components
import Header from "@/app/components/header/Header";
import ProfileSecTxt from "@/app/components/profileTxt/ProfileSecTxt";
import ProfileTxt from "@/app/components/profileTxt/ProfileTxt";

// Profile settings page component
export default async function Profile() {
    // Zde by měl být získán aktuální uživatel, např. podle session
    // Pro ukázku použiji prvního uživatele v DB
    const User = await prisma.users.findFirst({
        include: {
            ticket_ticket_reported_userTousers: true,
            ticket_ticket_processing_userTousers: true,
            ticket_attachment: true,
        }
    });

    // Statistika
    const stats = {
        reportedTickets: User?.ticket_ticket_reported_userTousers.length ?? 0,
        processedTickets: User?.ticket_ticket_processing_userTousers.length ?? 0,
        uploadedAttachments: User?.ticket_attachment.length ?? 0,
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
                    {User?.username ?? "displayUsername"}
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
                        params={Promise.resolve({ SecTxt: "Surname:" })}
                    />
                    <ProfileTxt
                        params={Promise.resolve({ UserInfo: `${User?.surname ?? "displaySurname"}` })}
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
                        <Typography>
                            Počet nahraných příloh: {stats.uploadedAttachments}
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
                        <Button>
                            Change phone number
                        </Button>
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
