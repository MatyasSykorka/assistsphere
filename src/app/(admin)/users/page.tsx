// Next.js components
// import Link from "next/link";

// MUI components
import { 
    Typography,
} from "@mui/material";


// import custom components
import Header from "@/app/components/header/Header";
import UsersTable from "../../components/(userTable)/usersTable/UsersTable";

// import prisma client
import { prisma } from "@/lib/prisma";


// Users page component
export default async function Users() {
    const users = await prisma.user.findMany({
        include: {
            role_rel: true
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
                    sx={{
                        textAlign: "center",
                    }}
                    variant="h4"
                >
                    Here you can view and manage all user accounts, including roles and permissions.
                </Typography>
            </article>
            <UsersTable 
                users={users}
                roles={roles}
            />
        </>
    );
}