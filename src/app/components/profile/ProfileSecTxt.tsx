import { Typography } from "@mui/material";

export default async function ProfileSecTxt({ params }: {
    params: Promise<{ SecTxt: string }>;
}) {
    const { SecTxt } = await params;
    return (
        <Typography 
            color="textSecondary" 
            variant="h5"
        >
            {SecTxt}
        </Typography>
    );
}
