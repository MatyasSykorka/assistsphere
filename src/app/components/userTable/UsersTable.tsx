"use client";

import { 
    useState, 
    useMemo 
} from "react";

// MUI components
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    TableSortLabel,
    Box,
    Container
} from "@mui/material";

// import modal component
import ChangeRoleModal from "../modals/changeRole/changeRoleModal";

// MUI color imports
import { blue } from "@mui/material/colors";

// MUI utils
import { visuallyHidden } from '@mui/utils';

// Prisma types
import { Prisma } from '@prisma/client';

// This creates a type based on the Prisma query from the parent page, ensuring type safety.
type userWithRole = {
    include: { role_users_roleTorole: true }
};

type User = Prisma.usersGetPayload<userWithRole>;

interface UsersTableProps {
    users: User[];
}

type Order = 'asc' | 'desc';

function descendingComparator(a: User, b: User, orderBy: keyof User) {
    let bValue: string | number | undefined = b[orderBy] as string | number | undefined;
    let aValue: string | number | undefined = a[orderBy] as string | number | undefined;

    if (orderBy === 'role_users_roleTorole') {
        bValue = b.role_users_roleTorole?.role_name;
        aValue = a.role_users_roleTorole?.role_name;
    }

    // Treat null/undefined values consistently
    if (bValue == null) return -1;
    if (aValue == null) return 1;

    if (bValue < aValue) {
        return -1;
    }
    if (bValue > aValue) {
        return 1;
    }
    return 0;
}

function getComparator(
    order: Order,
    orderBy: keyof User,
): (a: User, b: User) => number {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
    array: readonly T[], 
    comparator: (a: T, b: T) => number
) {
    const stabilizedThis = array.map(
        (el, index) => [el, index] as [T, number]
    );
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
    id: keyof User | 'actions';
    label: string;
}

const headCells: readonly HeadCell[] = [
    { id: 'user_id',                label: 'ID'         },
    { id: 'name',                   label: 'Name'       },
    { id: 'surname',                label: 'Surname'    },
    { id: 'username',               label: 'Username'   },
    { id: 'email',                  label: 'Email'      },
    { id: 'role_users_roleTorole',  label: 'Role'       },
    { id: 'actions',                label: 'Actions'    },
];

export default function UsersTable({ users }: UsersTableProps) {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('user_id');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const handleRequestSort = (property: keyof User) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const sortedUsers = useMemo(() =>
        stableSort(
            users, 
            getComparator(order, orderBy)
        ),
        [users, order, orderBy]
    );

    const handleOpenChangeRoleModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseChangeRoleModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    return (
        <Container>
            <TableContainer>
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
                            }}>
                            {headCells.map((headCell) => (
                                <TableCell
                                    key={headCell.id}
                                    sortDirection={
                                        orderBy === headCell.id ? order : false
                                    }
                                >
                                    {headCell.id !== 'actions' ? (
                                        <TableSortLabel
                                            active={ orderBy === headCell.id }
                                            direction={ orderBy === headCell.id ? order : 'asc' }
                                            onClick={
                                                () => handleRequestSort(
                                                    headCell.id as keyof User
                                                )
                                            }
                                        >
                                            <b>{headCell.label}</b>
                                            {orderBy === headCell.id ? (
                                                <Box 
                                                    component="span" 
                                                    sx={visuallyHidden}
                                                >
                                                    {
                                                    order === 'desc' ? 
                                                        'sorted descending' : 
                                                        'sorted ascending'
                                                    }
                                                </Box>
                                            ) : null}
                                        </TableSortLabel>
                                    ) : (
                                        <b>{headCell.label}</b>
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sortedUsers.map((user) => (
                            <TableRow 
                                key={user.user_id} 
                                hover
                            >
                                <TableCell>{user.user_id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.surname}</TableCell>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role_users_roleTorole?.role_name ?? "N/A"}</TableCell>
                                <TableCell>
                                    <Button 
                                        variant="contained" 
                                        color="error" 
                                        size="small"
                                    >
                                        Delete
                                    </Button>
                                    <Button 
                                        variant="contained" 
                                        color="primary" 
                                        size="small" 
                                        sx={{ ml: 1 }}
                                        onClick={() => handleOpenChangeRoleModal(user)}
                                    >
                                        Change role
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <ChangeRoleModal
                open={isModalOpen}
                onClose={handleCloseChangeRoleModal}
                user={selectedUser}
            />
        </Container>
    );
}