// Next.js components
// import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// MUI components
import Typography from "@mui/material/Typography";
import { 
    Container, 
    Grid
} from "@mui/material";

// import custom components
import Header from "@/app/components/header/Header";
import TicketCard from "../components/(ticketComponents)/ticketTable/TicketCard";
import TicketFilter from "../components/(ticketComponents)/ticketFilter/ticketFilter";

// Tickets page component
export default async function Tickets(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const searchParams = await props.searchParams;

    const priorityFilter = searchParams?.priority ? Number(searchParams.priority) : undefined;
    const categoryFilter = searchParams?.category ? Number(searchParams.category) : undefined;
    const statusFilter = searchParams?.status ? Number(searchParams.status) : undefined;
    const userFilter = typeof searchParams?.user === 'string' ? searchParams.user : undefined;

    const whereClause: Prisma.ticketWhereInput = {
        ...(priorityFilter && { priority: priorityFilter }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(statusFilter && { status: statusFilter }),
        ...(userFilter && { reported_user: userFilter }),
    };

    const tickets = await prisma.ticket.findMany({
        where: whereClause,
        include: {
            description_ticket_descriptionTodescription: true,
            room_ticket_roomToroom: true,
            status_ticket_statusTostatus: true,
            priority_ticket_priorityTopriority: true,
            category_ticket_categoryTocategory: true,
            user_reported: true,
            user_processing: true
        },
        orderBy: {
            created_time: 'desc'
        }
    });

    // Sort tickets: move Resolved and Rejected to the end of the list
    tickets.sort((a, b) => {
        const statusA = a.status_ticket_statusTostatus?.status_name;
        const statusB = b.status_ticket_statusTostatus?.status_name;
        const isEndA = statusA === "Resolved" || statusA === "Rejected";
        const isEndB = statusB === "Resolved" || statusB === "Rejected";

        if (isEndA && !isEndB) return 1;
        if (!isEndA && isEndB) return -1;
        return 0;
    });

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        redirect("/login");
    }

    const currentUserId = session.user.id;
    let currentUserRole = (session.user as any).role_id as number | undefined;

    if (typeof currentUserRole !== "number") {
        const user = await prisma.user.findUnique({
            where: { id: currentUserId },
            select: { role_id: true },
        });
        currentUserRole = user?.role_id ?? 3;
    }

    const priorities = await prisma.priority.findMany();
    const categories = await prisma.category.findMany();
    const allStatuses = await prisma.status.findMany();
    const users = await prisma.user.findMany({
        select: { 
            id: true, 
            name: true, 
            email: true 
        }
    });

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
                    Here you can view and manage all reported tickets submitted by users.
                </Typography>
            </article>
            <Container
                sx={{  
                    mt: 4,
                    mb: 4,
                }}
            >
                <TicketFilter 
                    priorities={priorities}
                    categories={categories}
                    statuses={allStatuses}
                    users={users}
                />
                <Grid 
                    container 
                    spacing={3}
                >
                    {tickets.map((ticket) => (
                        <Grid 
                            item 
                            sx={{ width: 350 }}
                            key={ticket.ticket_id}
                        >
                            <TicketCard 
                                ticket={{
                                    ...ticket,
                                    created_time: ticket.created_time.toISOString()
                                }} 
                                currentUserId={currentUserId}
                                currentUserRole={currentUserRole}
                                statuses={allStatuses}
                            />
                            
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
}