import { Typography } from "@mui/material";

export default async function profileTxt({ params }: {
    params: Promise<{ UserInfo: string }>;
}) {
    const { UserInfo } = await params;
    return (
        <Typography 
            variant="h5"
        >
            { UserInfo }
        </Typography>
    );
}