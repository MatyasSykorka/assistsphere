// Next.js components
// import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// MUI component list
import {
    Typography,
    Container,
    Box,
    Card,
    CardContent,
    Stack,
    Grid,
    Paper,
    Avatar,
    Divider
} from "@mui/material";

// MUI icon imports
import { Assignment, AssignmentTurnedIn } from "@mui/icons-material";

// import prisma client
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// import custom components
import Header from "@/app/components/header/Header";

import AddPhoneNumber from "@/app/components/profile/AddPhoneNumber";
import DeleteAccountButton from "@/app/components/profile/DeleteAccountButton";
import ChangePassword from "@/app/components/profile/ChangePassword";
import ChangeEmail from "@/app/components/profile/ChangeEmail";

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
            role_rel: true,
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
            <Container 
                maxWidth="md" 
                sx={{ 
                    mt: 4, 
                    mb: 8 
                }}
            >
                <Paper 
                    elevation={0} 
                    sx={{ 
                        p: { 
                            xs: 3, 
                            md: 5 
                        }, 
                        borderRadius: 4, 
                        border: '1px solid', 
                        borderColor: 'divider' 
                    }}
                >
                    {/* Header Section */}
                    <Box 
                        sx={{ 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center', 
                            textAlign: 'center', 
                            mb: 4 
                        }}
                    >
                        <Avatar 
                            sx={{ 
                                width: 100, 
                                height: 100, 
                                mb: 2, 
                                bgcolor: 'primary.main',
                                fontSize: '2.5rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {User?.name ? User.name.charAt(0).toUpperCase() : "U"}
                        </Avatar>
                        <Typography 
                            variant="h4" 
                            fontWeight="bold" 
                            gutterBottom
                        >
                            {User?.name ?? "User"}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            color="text.secondary"
                        >
                            Manage your personal details and account settings.
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Personal Information */}
                    <Box 
                        sx={{ 
                            mb: 5,
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                            Personal Information
                        </Typography>
                        <Grid 
                            container 
                            spacing={3}
                            sx={{ 
                                justifyContent: 'center'
                            }}
                        >
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50', 
                                    borderRadius: 2 
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    display="block" 
                                    gutterBottom
                                >
                                    Full Name
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    fontWeight="medium"
                                >
                                    {User?.name ?? "Not set"}
                                </Typography>
                            </Box>
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50', 
                                    borderRadius: 2 
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    display="block" 
                                    gutterBottom
                                >
                                    Email Address
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    fontWeight="medium"
                                >
                                    {User?.email ?? "Not set"}
                                </Typography>
                            </Box>
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50', 
                                    borderRadius: 2 
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    display="block" 
                                    gutterBottom
                                >
                                    Phone Number
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    fontWeight="medium"
                                >
                                    {User?.phone_number ?? "Not provided"}
                                </Typography>
                            </Box>
                            <Box 
                                sx={{ 
                                    p: 2, 
                                    bgcolor: 'grey.50', 
                                    borderRadius: 2 
                                }}
                            >
                                <Typography 
                                    variant="caption" 
                                    color="text.secondary" 
                                    display="block" 
                                    gutterBottom
                                >
                                    Role
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    fontWeight="medium"
                                >
                                    {User?.role_rel?.role_name ?? "User"}
                                </Typography>
                            </Box>
                        </Grid>
                    </Box>

                    {/* Statistics Section */}
                    <Box 
                        sx={{ 
                            mb: 5 
                        }}
                    >
                        <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            gutterBottom 
                            sx={{ 
                                mb: 3 
                            }}
                        >
                            Activity Overview
                        </Typography>
                        <Grid 
                            container 
                            spacing={2}
                            sx={{
                                justifyContent: 'center'
                            }}
                        >
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    bgcolor: '#e3f2fd', 
                                    borderRadius: 3, 
                                    height: '100%' 
                                }}
                            >
                                <CardContent>
                                    <Stack 
                                        direction="row" 
                                        alignItems="center" 
                                        spacing={2}
                                    >
                                        <Box 
                                            sx={{ 
                                                p: 1.5, 
                                                bgcolor: 'white', 
                                                borderRadius: '50%', 
                                                display: 'flex' 
                                            }}
                                        >
                                            <Assignment color="primary" />
                                        </Box>
                                        <Box>
                                            <Typography 
                                                variant="h4" 
                                                fontWeight="bold" 
                                                color="primary.main"
                                            >
                                                {stats.reportedTickets}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                fontWeight="medium"
                                            >
                                                Reported Tickets
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                            <Card 
                                elevation={0} 
                                sx={{ 
                                    bgcolor: '#e8f5e9', 
                                    borderRadius: 3, 
                                    height: '100%' 
                                }}
                            >
                                <CardContent>
                                    <Stack 
                                        direction="row" 
                                        alignItems="center" 
                                        spacing={2}
                                    >
                                        <Box 
                                            sx={{ 
                                                p: 1.5, 
                                                bgcolor: 'white', 
                                                borderRadius: '50%', 
                                                display: 'flex' 
                                            }}
                                        >
                                            <AssignmentTurnedIn color="success" />
                                        </Box>
                                        <Box>
                                            <Typography 
                                                variant="h4" 
                                                fontWeight="bold" 
                                                color="success.main"
                                            >
                                                {stats.processedTickets}
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                color="text.secondary" 
                                                fontWeight="medium"
                                            >
                                                Processed Tickets
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Box>

                    <Divider sx={{ my: 4 }} />

                    {/* Security & Actions */}
                    <Box>
                        <Typography 
                            variant="h6" 
                            fontWeight="bold" 
                            gutterBottom 
                            sx={{ 
                                mb: 3 
                            }}
                        >
                            Security & Actions
                        </Typography>
                        <Stack 
                            spacing={2}
                        >
                            <Box 
                                sx={{ 
                                    display: 'flex', 
                                    flexDirection: { 
                                        xs: 'column', 
                                        sm: 'row' 
                                    }, 
                                    gap: 2,
                                    justifyContent: 'center' 
                                }}
                            >
                                <ChangePassword />
                                <ChangeEmail currentEmail={User?.email} />
                                <AddPhoneNumber currentPhoneNumber={User?.phone_number} />
                            </Box>
                            
                            <Box 
                                sx={{ 
                                    pt: 2 
                                }}
                            >
                                <DeleteAccountButton 
                                    isAdmin={User?.role_id === 1} 
                                />
                            </Box>
                        </Stack>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}
