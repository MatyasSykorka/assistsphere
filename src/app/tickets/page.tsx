// Next.js components
// import Link from "next/link";
import { prisma } from "@/lib/prisma";

// MUI components
import Typography from "@mui/material/Typography";
import { 
    Container, 
    Card, 
    CardContent, 
    CardActions, 
    Button 
} from "@mui/material";

// MUI color imports
import { 
    deepOrange, 
    blue,
    green,
    red,
    grey
} from "@mui/material/colors";

// import custom components
import Header from "@/app/components/header/Header";

// Tickets page component
export default async function Tickets() {
    const tickets = await prisma.ticket.findMany({
        include: {
            description_ticket_descriptionTodescription: true,
            room_ticket_roomToroom: true,
            status_ticket_statusTostatus: true,
            users_ticket_reported_userTousers: true,
            users_ticket_processing_userTousers: true
        }
    });

    function getStatusColor(
        statusName: string | undefined
    ) {
        switch (statusName) {
            case "Open":
                return `${deepOrange[500]}`;
            case "In Progress":
                return `${blue[500]}`;
            case "Resolved":
                return `${green[700]}`;
            case "Rejected":
                return `${red[500]}`;
            default:
                return `${grey[500]}`;
        }
    }


    return (
        <>
            <Header
                title="Tickets"
                subtitle="View and manage support tickets."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can view and manage all support tickets submitted by users.
                </Typography>
                
                
                <Typography
                    variant="h3"
                    fontWeight="bold"
                    sx={{
                        color: red[700],
                    }}
                >
                    Add sorting and filtering options in the future!
                </Typography>



                
            </article>
            <Container
                sx={{  
                    gap: 2, 
                    mt: 4,
                    mb: 4,
                }}
            >
                {tickets.map((ticket) => (
                    <Card 
                        key={ ticket.ticket_id } 
                        sx={{ 
                            mb: 2, 
                            p: 2, 
                            border: '1px solid #ccc', 
                            borderRadius: '8px',
                        }}
                    >
                        <CardContent>
                            <Typography 
                                variant="body1"
                            >
                                Ticket number:&nbsp; 
                                <b>
                                    { ticket.ticket_id }
                                </b>
                            </Typography>
                            <Typography 
                                variant="h5"
                            >
                                <b>
                                    { ticket.ticket_title }
                                </b>
                            </Typography>
                            <Typography 
                                variant="body2"
                            >
                                Status:&nbsp;
                                <Typography
                                    component="span"
                                    fontWeight="bold"
                                    variant="body2"
                                    sx={{ 
                                    color: getStatusColor(
                                        ticket.status_ticket_statusTostatus?.status_name
                                    )
                                }}
                                >
                                    { ticket.status_ticket_statusTostatus?.status_name ?? "Unknown" }
                                </Typography>
                            </Typography>
                            <Typography
                                variant="body2"
                            >
                                Room:&nbsp;
                                <b>
                                    { ticket.room_ticket_roomToroom?.name }
                                </b>
                            </Typography>
                            <Typography
                                variant="body2"
                            >
                                Created by:&nbsp;
                                <b>
                                    { ticket.users_ticket_reported_userTousers?.name }
                                    &nbsp;
                                    { ticket.users_ticket_reported_userTousers?.surname }
                                </b>
                            </Typography>
                            <Typography
                                variant="body2"
                            >
                                Processing user:&nbsp;
                                <b>
                                    { 
                                    ticket.users_ticket_processing_userTousers
                                        ? `${ ticket.users_ticket_processing_userTousers.name } ${ ticket.users_ticket_processing_userTousers.surname }` : "nobody" }
                                </b>
                            </Typography>
                            {
                                /*
                                // make description under a show more button
                                    <Typography 
                                        key={ ticket.ticket_id } 
                                        variant="body2"
                                    >
                                        Ticket description:&nbsp;
                                        <span>
                                            { ticket.description_ticket_descriptionTodescription?.description }
                                        </span>
                                    </Typography>
                                */
                            }
                        </CardContent>
                        <CardActions>
                            <Button
                                size="small"
                                variant="outlined"
                                sx={{
                                    marginTop: "auto"
                                }}
                            >
                                Show more
                            </Button>
                        </CardActions>
                    </Card>
                ))}
            </Container>
        </>
    );
}