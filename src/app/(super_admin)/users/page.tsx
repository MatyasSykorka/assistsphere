// Next.js components
// import Link from "next/link";

// MUI components
import { 
    Container, 
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button
} from "@mui/material";

// MUI color imports
import { 
    blue,
} from "@mui/material/colors";

// import custom components
import Header from "@/app/components/header/Header";

// import prisma client
import { prisma } from "@/lib/prisma";


// Users page component
export default async function Users() {
    const Users = await prisma.users.findMany({
        include: {
            role_users_roleTorole: true
        }
    });

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
            <Container>
                <Table
                    sx={{ 
                        marginTop: "1rem",
                        border: "1px solid #ccc",
                        borderRadius: "8px"
                    }}

                >
                    <TableHead>
                        <TableRow
                            sx={{
                                backgroundColor: `${blue[100]}`
                            }}
                        >
                            <TableCell
                                variant="head"
                            >
                                <b>
                                    ID
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Name
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Surname
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Username
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Email
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Role
                                </b>
                            </TableCell>
                            <TableCell>
                                <b>
                                    Actions
                                </b>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Users.map((user) => (
                            <TableRow 
                                key={user.user_id}
                                hover
                            >
                                <TableCell>
                                    {user.user_id}
                                </TableCell>
                                <TableCell>
                                    {user.name}
                                </TableCell>
                                <TableCell>
                                    {user.surname}
                                </TableCell>
                                <TableCell>
                                    {user.username}
                                </TableCell>
                                <TableCell>
                                    {user.email}
                                </TableCell>
                                <TableCell>
                                    {user.role_users_roleTorole?.role_name ?? "N/A"}
                                </TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        size="small"
                                        // onClick={() => handleDelete(user.user_id)}
                                        // disabled
                                    >
                                        Smazat
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small"
                                        sx={{ ml: 1 }}
                                        // onClick={() => handleChangeRole(user.user_id)}
                                        // disabled
                                    >
                                        Změnit roli
                                        {
                                            // create modal to change user role
                                        }
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Container>
        </>
    );
}