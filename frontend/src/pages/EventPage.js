import EventTable from "../components/EventTable";
import Footer from "../components/Footer";
import Box from "@mui/material/Box";

const sampleData = [
    { id: 1, name: 'Event 1', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 2, name: 'Event 2', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 3, name: 'Event 3', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 4, name: 'Event 4', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 5, name: 'Event 5', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 6, name: 'Event 6', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 7, name: 'Event 7', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 8, name: 'Event 8', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 9, name: 'Event 9', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 10,  name: 'Event 10', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 11, name: 'Event 12', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 12, name: 'Event 20', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 13, name: 'Event 18', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
    { id: 14, name: 'Event 25', sender: 'Sender 2', sendDate: '2025-04-22', location: 'Location 2', date: '2025-04-23', time: '11:00 AM', cc: 'Recipient 2' },
    { id: 15, name: 'Event 16', sender: 'Sender 1', sendDate: '2025-04-21', location: 'Location 1', date: '2025-04-22', time: '10:00 AM', cc: 'Recipient 1' },
];

export default function EventPage() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <EventTable tableData={sampleData} showButton={false} />
            <Footer />
        </Box>
    );
}