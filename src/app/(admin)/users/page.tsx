// Next.js components
// import Link from "next/link";

// MUI components
import { 
    Typography,
} from "@mui/material";


// import custom components
import Header from "@/app/components/header/Header";
import UsersTable from "../../components/userTable/UsersTable";

// import prisma client
import { prisma } from "@/lib/prisma";


// Users page component
export default async function Users() {
    const Users = await prisma.users.findMany({
        include: {
            role_users_roleTorole: true
        }
    });
    
    const roles = await prisma.role.findMany();

    return (
        <>
            <Header
                title="Users"
                subtitle="Manage user accounts and permissions."
            />
            <article>
                <Typography
                    variant="h4"
                >
                    Here you can view and manage all user accounts, including roles and permissions.
                </Typography>
            </article>
            <UsersTable 
                users={Users}
                roles={roles}
            />
        </>
    );
}