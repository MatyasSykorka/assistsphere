// Next.js components
// import Link from "next/link";

// MUI component list
import {
    Typography,
    Container,
    Button,
    Box
} from "@mui/material";


// import custom components
import Header from "@/app/components/header/Header";

// Profile settings page component
export default function Profile() {
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
                    displayUsername
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
                        marginBottom: "3vh"
                    }}
                >
                    <Typography
                        color="textSecondary"
                        variant="h5"
                    >
                        Name:
                    </Typography>
                    <Typography
                        variant="h5"
                    >
                        displayName
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="h5"
                    >
                        Surname:
                    </Typography>
                    <Typography
                        variant="h5"
                    >
                        displaySurname
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="h5"
                    >
                        Email:
                    </Typography>
                    <Typography
                        variant="h5"
                    >
                        displayEmail
                    </Typography>
                    <Typography
                        color="textSecondary"
                        variant="h5"
                    >
                        Phone number:
                    </Typography>
                    <Typography
                        variant="h5"
                    >
                        displayPhoneNum
                    </Typography>
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

                    {/*
                    Maybe this button will change 
                    from server component to client component in the future

                    Because it will show modal component for confirmation
                    */}
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