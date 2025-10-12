// import core libraries
import {
    Link,
    Button
} from "@mui/material";

// Home page component
export default function Home() {
    return (
        <>
            <h1>AssistSphere</h1>
            <p>
                Your one-stop solution for all assistance needs.
            </p>
            <Button
                component={Link}
                href="/about"
                variant="contained"
                color="primary"
            >
                About this project
            </Button>
        </>
    );
}
