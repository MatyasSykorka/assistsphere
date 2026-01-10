"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Autocomplete,
    Grid,
    Button,
    SelectChangeEvent,
    Container
} from "@mui/material";

interface FilterProps {
    priorities: { 
        priority_id: number; 
        priority_type: string 
    }[];
    categories: { 
        category_id: number; 
        category_name: string 
    }[];
    statuses: { 
        status_id: number; 
        status_name: string 
    }[];
    users: { 
        id: string; 
        name: string; 
        email: string 
    }[];
}

export default function TicketFilter({ 
    priorities, 
    categories, 
    statuses, 
    users 
}: FilterProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [priority, setPriority] = useState<string>(searchParams.get("priority") || "");
    const [category, setCategory] = useState<string>(searchParams.get("category") || "");
    const [status, setStatus] = useState<string>(searchParams.get("status") || "");
    const [user, setUser] = useState<string>(searchParams.get("user") || "");

    // Sync state with URL params if they change externally
    useEffect(() => {
        setPriority(searchParams.get("priority") || "");
        setCategory(searchParams.get("category") || "");
        setStatus(searchParams.get("status") || "");
        setUser(searchParams.get("user") || "");
    }, [searchParams]);

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (priority) {
            params.set("priority", priority);
        }
        else {
            params.delete("priority");
        };

        if (category) {
            params.set("category", category);
        }
        else {
            params.delete("category");
        }

        if (status) {
            params.set("status", status);
        }
        else {
            params.delete("status");
        }

        if (user) {
            params.set("user", user);
        }
        else {
            params.delete("user");
        }

        router.push(`${pathname}?${params.toString()}`);
    };

    const clearFilters = () => {
        setPriority("");
        setCategory("");
        setStatus("");
        setUser("");
        router.push(pathname);
    };

    return (
        <Box 
            sx={{ 
                mb: 4, 
                p: 2, 
                bgcolor: 'background.paper', 
                borderRadius: 1, 
                boxShadow: 1 
            }}
        >
            <Container  
                sx={{ 
                    display: 'grid', 
                    gridTemplateColumns: { 
                        xs: '1fr', 
                        sm: '1fr 1fr', 
                        md: 'repeat(6, 1fr)' 
                    }, 
                    gap: 2 
                }}
            >
                <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={2}
                >
                    <FormControl 
                        fullWidth 
                        size="small"
                    >
                        <InputLabel 
                            id="priority-label"
                        >
                            Priority
                        </InputLabel>
                        <Select
                            labelId="priority-label"
                            value={priority}
                            label="Priority"
                            onChange={
                                (e: SelectChangeEvent) => setPriority(e.target.value)
                            }
                        >
                            <MenuItem 
                                value=""
                            >
                                <em>
                                    None
                                </em>
                            </MenuItem>
                            {priorities.map((p) => (
                                <MenuItem 
                                    key={p.priority_id} 
                                    value={
                                        p.priority_id.toString()
                                    }
                                >
                                    {p.priority_type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={2}
                >
                    <FormControl 
                        fullWidth 
                        size="small"
                    >
                        <InputLabel 
                            id="category-label"
                        >
                            Category
                        </InputLabel>
                        <Select
                            labelId="category-label"
                            value={category}
                            label="Category"
                            onChange={
                                (e: SelectChangeEvent) => setCategory(e.target.value)
                            }
                        >
                            <MenuItem 
                                value=""
                            >
                                <em>
                                    None
                                </em>
                            </MenuItem>
                            {categories.map((c) => (
                                <MenuItem 
                                    key={c.category_id} 
                                    value={
                                        c.category_id.toString()
                                    }
                                >
                                    {c.category_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={2}
                >
                    <FormControl 
                        fullWidth 
                        size="small"
                    >
                        <InputLabel 
                            id="status-label"
                        >
                            Status
                        </InputLabel>
                        <Select
                            labelId="status-label"
                            value={status}
                            label="Status"
                            onChange={
                                (e: SelectChangeEvent) => setStatus(e.target.value)
                            }
                        >
                            <MenuItem 
                                value=""
                            >
                                <em>
                                    None
                                </em>
                            </MenuItem>
                            {statuses.map((s) => (
                                <MenuItem 
                                    key={s.status_id} 
                                    value={
                                        s.status_id.toString()
                                    }
                                >
                                    {s.status_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    sm={6} 
                    md={3}
                >
                    <Autocomplete
                        options={users}
                        getOptionLabel={
                            (option) => `${option.name} (${option.email})`
                        }
                        value={
                            users.find(u => u.id === user) || null
                        }
                        onChange={
                            (_, newValue) => setUser(newValue ? newValue.id : "")
                        }
                        renderInput={
                            (params) => 
                                <TextField 
                                    {...params} 
                                    label="Reported User" 
                                    size="small" 
                                />
                        }
                        isOptionEqualToValue={
                            (option, value) => option.id === value.id
                        }
                    />
                </Grid>
                <Grid 
                    item 
                    xs={12} 
                    md={3} 
                    sx={{ 
                        display: 'flex', 
                        gap: 1, 
                        justifyContent: { 
                            xs: 'flex-start', 
                            md: 'flex-end' 
                        } 
                    }}
                >
                    <Button 
                        variant="outlined" 
                        onClick={clearFilters} 
                        color="secondary"
                    >
                        Clear
                    </Button>
                    <Button 
                        variant="contained" 
                        onClick={
                            applyFilters
                        }    
                    >
                        Search
                    </Button>
                </Grid>
            </Container>
        </Box>
    );
}
