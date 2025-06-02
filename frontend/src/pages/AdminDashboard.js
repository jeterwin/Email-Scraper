import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import UserTable from "../components/UserTable";
import Footer from "../components/Footer";
import FavEventTable from "../components/FavEventTable";
import DashboardEventTable from "../components/DashboardEventTable";

export default function Dashboard() {
    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
                <UserTable />
            </Box>
            <DashboardEventTable />
            <Footer />
        </Box>
    )
}