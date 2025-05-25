import EventTable from "../components/EventTable";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";


export default function EventPage() {
    return (
        <>
            <CssBaseline />
            <Box sx={{ display: 'flex', flexDirection: 'column', backgroundColor: '#f4f7fe', minHeight: '100vh' }}>
                <EventTable showButton={false} />
                <Footer />
            </Box>
        </>
    );
}