import Box from "@mui/material/Box";
import Navbar from "../components/Navbar";
import EventTable from "../components/EventTable";
import ActivityGraph from "../components/ActivityGraph";
import Footer from "../components/Footer";
import FavEventTable from "../components/FavEventTable";

const sampleData = [
    { id: 1, name: 'Event 1', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 2, name: 'Event 2', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 3, name: 'Event 3', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 4, name: 'Event 4', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 5, name: 'Event 5', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 6, name: 'Event 6', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },

];

export default function Dashboard() {

    return (
        //backgroundImage: 'url(/images/background.jpg)',
        <Box sx={{minHeight: '100vh', backgroundColor: '#f4f7fe', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            <Navbar />
            <Box sx={{ display: "flex", direction: "row" }}>
                <ActivityGraph />
                <FavEventTable selectedEvents={sampleData} />
            </Box>
            <EventTable tableData={sampleData} showButton={true}/>
            <Footer />
        </Box>
    )
}