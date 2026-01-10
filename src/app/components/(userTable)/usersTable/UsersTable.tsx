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

// import modal and action components
import ChangeRoleModal from "@/app/components/(userTable)/changeRole/changeRoleModal";
import DeleteUserModal from "@/app/components/(userTable)/deleteUser/deleteUserModal";

// MUI color imports
import { blue } from "@mui/material/colors";

// MUI utils
import { visuallyHidden } from '@mui/utils';

// Prisma types
import { Prisma } from '@prisma/client';

// This creates a type based on the Prisma query from the parent page, ensuring type safety.
type userWithRole = {
    include: { role_rel: true }
};

type User = Prisma.UserGetPayload<userWithRole>;

interface Role {
    role_id: number;
    role_name: string;
}

interface UsersTableProps {
    users: User[];
    roles: Role[];
}

type Order = 'asc' | 'desc';

function descendingComparator(
    a: User, 
    b: User, 
    orderBy: keyof User
) {
    let bValue: string | number | undefined = b[orderBy] as string | number | undefined;
    let aValue: string | number | undefined = a[orderBy] as string | number | undefined;

    if (orderBy === 'role_rel') {
        bValue = b.role_rel?.role_name;
        aValue = a.role_rel?.role_name;
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
): (
    a: User, 
    b: User
) => number {
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
    { id: 'id',         label: 'ID'      },
    { id: 'name',       label: 'Name'    },
    { id: 'email',      label: 'Email'   },
    { id: 'role_rel',   label: 'Role'    },
    { id: 'actions',    label: 'Actions' },
];

export default function UsersTable(
    { users, roles }: UsersTableProps
) {
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof User>('id');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);

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

    const handleOpenDeleteModal = (user: User) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
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
                                key={user.id} 
                                hover
                            >
                                <TableCell>{user.id}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.role_rel?.role_name}</TableCell>
                                <TableCell>
                                    {
                                        user.role_rel?.role_id !== 1 && (
                                            <>
                                                <Button 
                                                    variant="contained" 
                                                    color="error" 
                                                    size="small"
                                                    onClick={
                                                        () => handleOpenDeleteModal(user)
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    size="small" 
                                                    sx={{ ml: 1 }}
                                                    onClick={
                                                        () => handleOpenChangeRoleModal(user)
                                                    }
                                                >
                                                    Change role
                                                </Button>
                                            </>
                                        )
                                    }
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
                roles={roles}
            />
            <DeleteUserModal
                open={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                user={userToDelete}
            />
        </Container>
    );
}