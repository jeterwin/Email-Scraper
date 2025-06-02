import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventTable from './EventTable';

export default function DashboardEventTable() {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get('http://localhost/email_scraper/Backend/Auth/Database/fetch_scrape_results.php?limit=5&sortBy=meeting_time');
                const mappedData = response.data.map(item => ({
                    name: item.meeting_title,
                    sender: item.sender,
                    sendDate: item.send_date,
                    location: item.meeting_location,
                    datetime: item.meeting_time,
                    cc: item.cc,
                    bcc: item.bcc,
                    checkbox: item.interested,
                }));
                setTableData(mappedData);
            } catch (error) {
                console.error('Failed to fetch limited data:', error);
            }
        }

        fetchData();
    }, []);

    return <EventTable data={tableData} showButton={true} />;
}
